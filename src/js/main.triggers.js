/*global require*/


(function() {
    'use strict';
    // var $ = require('jquery');
    var videoMaker = require('./videomaker');
    var animate;

    var scrollSections = [{
        start: 0,
        stop: 0.2,
        actions: {
            // forward: showVideo,
            reverse: hideVideo
        }
    }, {
        start: 0.2,
        stop: 0.4,
        actions: {
            forward: playForward,
            reverse: playReverse
        }
    }, {
        start: 0.4,
        stop: 0.6,
        actions: {
            forward: hideVideo
        }
    }, ];
    var currentSection = scrollSections[0];
    var previousSection = scrollSections[0];

    var videoPlayer;

    var scrollContainerEl = document.getElementById('scrolling-area-container');
    var videoContainerEl = document.getElementById('video-container');
    var infoEl = document.getElementById('info-display');
    // var scrollEl = document.getElementById('scrolling-area');

    var videoReady = false;
    //
    var throttle = function(type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function() {
            if (running) {
                return;
            }
            running = true;
            setTimeout(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;

            }, 100);
        };
        obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle('scroll', 'optimizedScroll', scrollContainerEl);

    scrollContainerEl.addEventListener('optimizedScroll', function() {
        checkScroll();

        updateReadout();
    });

    var time = 0;
    var targetOpacity = 0;
    var currentOpacity = 0;
    var currentPlaybackSpeed = 0.0;
    var targetPlaybackSpeed = 0.0;
    var forwardPlaybackSpeed = 0.1;
    var reversePlaybackSpeed = -0.1;

    function showVideo() {
        console.log('show video');
        targetOpacity = 1;
    }
    function hideVideo() {
        targetOpacity = 0;
    }
    function indexOfSection(section) {
        return scrollSections.indexOf(section);
    }

    function checkScroll() {
        var pct = scrollContainerEl.scrollTop / (scrollContainerEl.scrollHeight - scrollContainerEl.clientHeight);
        determineSection(pct);
        if (currentSection === previousSection) {
            //do nothing
        } else if (indexOfSection(previousSection) - indexOfSection(currentSection) === 1) {
            //moved one section in reverse, play reverse video
            if (currentSection && currentSection.actions && currentSection.actions.reverse) {
          
                currentSection.actions.reverse();
            }
        } else {
            //either moved forward, or arrived from a distant/unknown section. Play forward.
            if (currentSection && currentSection.actions && currentSection.actions.forward) {

                 currentSection.actions.forward();
            }
        }

    }

    function updateReadout() {
        var sec = indexOfSection(currentSection) !== -1 ? indexOfSection(currentSection) : 'none';
        infoEl.innerHTML = 'Section: ' + sec;
    }

    function determineSection(pct) {
        var i = 0;
        var loops = scrollSections.length;
        var inASection = false;
        while (i < loops) {
            var section = scrollSections[i];
            if (section.start <= pct && section.stop > pct) {
                previousSection = currentSection;
                currentSection = section;
                inASection = true;
                break;
            }

            i += 1;
        }

        if (inASection === false) {
            previousSection = currentSection;
            currentSection = null;
        }
    }

    function playForward() {
        showVideo();
        videoPlayer.setTime(0);
        targetPlaybackSpeed = forwardPlaybackSpeed;
    }
    function playReverse () {
        showVideo();
        videoPlayer.setTime(videoPlayer.getDuration());
        targetPlaybackSpeed = reversePlaybackSpeed;
    }

    animate = function() {
        if (videoReady) {
            currentPlaybackSpeed += (targetPlaybackSpeed - currentPlaybackSpeed) / 5;
            time += currentPlaybackSpeed;
            if (time < 0) {
                time = 0;
            } else if (time > videoPlayer.getDuration()) {
                time = videoPlayer.getDuration();
            }

            videoPlayer.setTime(time);

            currentOpacity += (targetOpacity - currentOpacity) / 4;
            currentOpacity = Math.round(currentOpacity * 100) / 100;
            if (Math.abs(targetOpacity - currentOpacity) < 0.05) {
                currentOpacity = targetOpacity;
            }
            videoPlayer.getEl().style.opacity = currentOpacity;

        }

        requestAnimationFrame(animate);
    };



    videoPlayer = videoMaker.makeVideoPlayer({
        startInvisible: true,
        visibleOnLoad: true
    });
    videoPlayer.onLoadProgress(function handleLoadProgress(pct) {
        console.log('loaded:', pct);
    });
    videoPlayer.onLoad(function handleVideoLoaded() {
        console.log('fully loaded');
        videoReady = true;
        // videoPlayer.setTimeAsPercent(0.5);
    });

    videoPlayer.init({
        base: 'media/',
        // webm: 'hm-video-1-2.webm',
        // ogg: 'twoheads_480p_1mbps.ogv',
        // mp4: 'hm-video-1.mp4'
        // mp4: 'videoClip02.mp4'
        mp4: 'hm-video-720w_1kf_5mb_5sec.mp4'

    });

    var videoEl = videoPlayer.getEl();
    videoContainerEl.appendChild(videoEl);
    videoPlayer.load();

    checkScroll();
    updateReadout();

    requestAnimationFrame(animate);
})();