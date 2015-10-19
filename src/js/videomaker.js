/*global require, module*/
'use strict';
//dependencies: libraries
var Signal = require('signals');

//dependencies: application modules

//dependencies: application classes 

//functions
var makeVideoPlayer;
//properties & objects


makeVideoPlayer = function(options) {
    var publicMethods;

    var startInvisible = true;
    var visibleOnLoad = true;
    console.log(options);
    if (options) {
        if (typeof options.startInvisible !== 'undefined') {
            startInvisible = options.startInvisible;
        }

        if (typeof options.visibleOnLoad !== 'undefined') {
            visibleOnLoad = options.visibleOnLoad;
        }
    }


    var videoEl,
        videoFile,
        hasForcedSeek = false,
        numberOfChecks = 0,
        percentLoaded = 0,
        previousPercentLoaded = 0,
        reloadAttempt = 0,
        maxreloadAttempts = 6,
        forceFullPreload;

    var videoLoadedSignal = new Signal();
    var videoTimeUpdateSignal = new Signal();
    var videoEndSignal = new Signal();
    var videoLoadProgressSignal = new Signal();

    //functions
    var init;
    var load;
    var loadcheck;
    var playVideo;
    var pauseVideo;
    var loopVideo;
    var videoSufficientlyLoaded;

    var checkHasStartedLoadingTimer;
    var trickPreloadEntireVideo;
    var reload;
    var getLoadPercent;
    var handleVideoUpdate;
    var videoTimeWatchInterval;
    var checkLoadTimer;
    var handleVideoEnded;
    // console.log(videoFile);


    init = function(_videoFile) {
        videoFile = _videoFile;
        videoEl = document.createElement('video');
        // videoEl = document.getElementById('temp-video');
        videoEl.setAttribute('preload', 'auto');
        videoEl.setAttribute('controls', true);
        if (startInvisible === true) {
            console.log('startInvisible');
            videoEl.style.visibility = 'hidden';
        }
        // videoEl.setAttribute('webkit-playsinline', '');
        // videoEl.setAttribute('width', 720);
        // videoEl.setAttribute('height', 404);

        if (videoFile.webm) {
            var sourceWebMEl = document.createElement('source');
            sourceWebMEl.setAttribute('src', videoFile.base + videoFile.webm);
            sourceWebMEl.setAttribute('type', 'video/webm');
            videoEl.appendChild(sourceWebMEl);
        }

        if (videoFile.ogg) {
            var sourceOggEl = document.createElement('source');
            sourceOggEl.setAttribute('src', videoFile.base + videoFile.ogg);
            sourceOggEl.setAttribute('type', 'video/ogg');
            videoEl.appendChild(sourceOggEl);
        }

        if (videoFile.mp4) {
            var sourceMP4El = document.createElement('source');
            sourceMP4El.setAttribute('src', videoFile.base + videoFile.mp4);
            sourceMP4El.setAttribute('type', 'video/mp4');
            videoEl.appendChild(sourceMP4El);

        }


        videoTimeWatchInterval = setInterval(function() {
            handleVideoUpdate();
        }, 1000 / 24);

        // var myVideo = document.getElementsByTagName('video')[0];


        videoEl.addEventListener('ended', handleVideoEnded);
    };

    handleVideoEnded = function() {
        videoEndSignal.dispatch();
    };


    handleVideoUpdate = function() {
        videoTimeUpdateSignal.dispatch(videoEl.currentTime);

    };

    videoSufficientlyLoaded = function() {
        clearInterval(checkLoadTimer);
        clearInterval(forceFullPreload);

        pauseVideo();

        videoLoadedSignal.dispatch();
        if (visibleOnLoad === true) {

            videoEl.style.visibility = 'visible';

        }
    };
    load = function() {

        videoEl.load();

        checkLoadTimer = setInterval(function() {
            loadcheck();

            if (percentLoaded > 0.98) {
                videoSufficientlyLoaded();
            } else {
                videoLoadProgressSignal.dispatch(percentLoaded);
            }

        }, 1000);

        // $('video').bind('progress', function() {
        //   console.log('jquery: ' + $('video').get(0).buffered.end(0) / $('video').get(0).duration);
        // });


    };

    // var preloadStuckCounter = 0;
    // var maxPreloadStuckCouter = 5;

    // var reloadCheck = 0;
    // var checksBeforeReload = 5;
    loadcheck = function() {
        previousPercentLoaded = percentLoaded;
        var newLoadPercent = getLoadPercent();


        // if (newLoadPercent === 0 && percentLoaded === 0) {
        //     reloadCheck += 1;
        //     if (reloadCheck >= checksBeforeReload) {
        //         reloadCheck = 0;
        //         reload();
        //     }
        // } else {
        //     //got stuck on preload somewhere besides 0  
        //     if (newLoadPercent === percentLoaded) {
        //         preloadStuckCounter += 1;

        //         if (preloadStuckCounter >= maxPreloadStuckCouter) {
        //             videoSufficientlyLoaded();
        //         }

        //     } else {
        //         preloadStuckCounter = 0;
        //     }
        // }



        percentLoaded = newLoadPercent;

        if (percentLoaded > 0.1) {
            trickPreloadEntireVideo();
        }

    };

    trickPreloadEntireVideo = function() {
        if (hasForcedSeek) {

            return;
        }

        hasForcedSeek = true;
        //////////////////////////////////////////////
        //By default some browsers will only preload up to a certain point if playback hasn't started. 
        //Start and stop video playback to encourage the video to keep on loading. 

        var count = 0;
        clearInterval(forceFullPreload);
        forceFullPreload = setInterval(function() {
            count += 1;
            // console.log('preload count:' + count);
            // console.log(videoEl.duration);
            if (count === 1) {
                // videoEl.currentTime = videoEl.duration * 0.9;
                playVideo();
            } else if (count === 2) {
                pauseVideo();
            } else if (count === 3) {
                playVideo();
            } else if (count === 4) {
                pauseVideo();
            }


            if (count >= 4) {
                clearInterval(forceFullPreload);
            }

        }, 250);
    };

    getLoadPercent = function() {
        var percent = 0;
        // console.log('-----')
        // console.log(videoEl);
        // console.log(videoEl.buffered);
        // try{
        //     console.log(videoEl.buffered.length);
        // } catch(e) {
        //     console.log(e);
        // }
        // try{
        //     console.log(videoEl.buffered.end(0));
        // } catch(e) {
        //     console.log(e);
        // }
        // console.log(videoEl.duration);
        // console.log(videoEl.bytesTotal);
        // console.log(videoEl.bufferedBytes);
        if (videoEl && videoEl.buffered && videoEl.buffered.length > 0 && videoEl.buffered.end && videoEl.duration) {
            percent = videoEl.buffered.end(0) / videoEl.duration;
            // console.log('percent 1', percent);
            // console.log('a', percent);
            // console.log('buffer end / duration:'+ videoEl.buffered.end(0) + '/' + videoEl.duration);
        } else if (videoEl && videoEl.bytesTotal !== undefined && videoEl.bytesTotal > 0 && videoEl.bufferedBytes !== undefined) {
            // Some browsers (e.g., FF3.6 and Safari 5) cannot calculate target.bufferered.end()
            // to be anything other than 0. If the byte count is available we use this instead.
            // Browsers that support the else if do not seem to have the bufferedBytes value and
            // should skip to there. Tested in Safari 5, Webkit head, FF3.6, Chrome 6, IE 7/8.
            percent = videoEl.bufferedBytes / videoEl.bytesTotal;
            // console.log('percent 2', percent);
            // console.log('b', percent);
            // console.log('bufferedBytes / bytesTotal:'+videoEl.buffered.end(0) + '/' + videoEl.duration);

        } else {
            // console.log('videoEl.buffered', videoEl.buffered);
            // console.log('nothing?');
        }
        // console.log(percent);

        // var myVideo = videoEl[0];
        // var endBuf = myVideo.buffered.end(0);
        // var soFar = parseInt(((endBuf / myVideo.duration) * 100));
        // console.log('soFar: ' + soFar);


        return percent;
    };
    reload = function() {
        if (reloadAttempt === 0) {
            videoEl.load();
        }

        if (reloadAttempt === 1) {
            playVideo();
        }
        if (reloadAttempt === 2) {
            videoEl.load();
        }

        if (reloadAttempt === 3) {
            playVideo();
        }
        if (reloadAttempt === 4) {
            videoEl.load();
        }
        if (reloadAttempt === 5) {
            playVideo();
        }

        if (reloadAttempt === maxreloadAttempts) {
            clearInterval(checkHasStartedLoadingTimer);
            // console.log('I quit');
            // errorManager_g.showError(ErrorMessage.VIDEO_LOAD_ERROR);
        }

        reloadAttempt++;
    };
    // 
    playVideo = function() {
        // console.log('play');
        videoEl.play();
    };
    pauseVideo = function() {
        // console.log('pause');
        videoEl.pause();
    };

    loopVideo = function() {
        this.currentTime = 0;
        this.play();

    };
    //Module API
    publicMethods = {

        init: function(el) {
            init(el);
        },

        cleanup: function() {
            clearInterval(videoTimeWatchInterval);
            clearInterval(checkLoadTimer);

            hasForcedSeek = false;
            numberOfChecks = 0;
            percentLoaded = 0;
            previousPercentLoaded = 0;
            reloadAttempt = 0;
            maxreloadAttempts = 6;

            pauseVideo();
            // videoEl.removeEventListener('timeupdate', handleVideoUpdate);
            videoEl.removeEventListener('ended', loopVideo);
            videoEl.removeEventListener('ended', handleVideoEnded);

            videoLoadedSignal.dispose();
            videoTimeUpdateSignal.dispose();
            videoEndSignal.dispose();
            videoLoadProgressSignal.dispose();

            videoEl.innerHTML = '';
            videoEl.setAttribute('src', '');
            // sourceMP4El.setAttribute('src', '');
            // sourceOggEl.setAttribute('src', '');
            // sourceWebMEl.setAttribute('src', '');
        },
        onVideoEnd: function(callback) {
            videoEndSignal.add(callback);
        },
        animate: function() {

        },

        loop: function() {
            videoEl.addEventListener('ended', loopVideo, false);
        },

        load: function() {
            load();
        },

        play: function() {
            playVideo();
        },
        pause: function() {
            // console.log('public method - pause');
            pauseVideo();
        },

        onLoad: function(callback) {
            videoLoadedSignal.add(callback);
        },
        onLoadProgress: function(callback) {
            videoLoadProgressSignal.add(callback);
        },
        onTimeUpdate: function(callback) {
            videoTimeUpdateSignal.add(callback);
        },
        getLoadPercent: function() {
            return getLoadPercent();
        },

        setTime: function(time, andPlay) {
            // console.log('SET TIME: ' + time + ', ' + andPlay);
            // console.log('current time: ' + videoEl.currentTime);
            videoEl.currentTime = time;
            if (andPlay === true) {
                playVideo();
            }

        },

        setTimeAsPercent: function(pct, andPlay) {
            try {
                
                var time = pct * videoEl.duration;

                time = Math.round(time * 100) / 100;
                // console.log((time));
                videoEl.currentTime = (time);
            } catch (e) {
                console.log('set time error', e);
            }
            // console.log('setTimeAsPercent', pct, andPlay);
            if (andPlay === true) {
                playVideo();
            } else {
                pauseVideo();
            }
        },

        setPlaybackSpeed: function(speed) {
            // console.log('speed: ' + speed);
            // pauseVideo();
            videoEl.playbackRate = speed;
            videoEl.defaultPlaybackRate = speed;
            // setTimeout(function () {
            //     console.log('play!');
            //     playVideo();
            // }, 1000);
        },
        getTime: function() {
            return videoEl.currentTime;
        },
        getDuration: function() {
            return videoEl.duration;
        },

        getEl: function() {
            return videoEl;
        }
    };

    return publicMethods;
};


module.exports = {
    makeVideoPlayer: makeVideoPlayer
};