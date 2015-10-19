/*global require*/


(function() {
    'use strict';
    // var $ = require('jquery');
    var videoMaker = require('./videomaker');



    var videoPlayer;
    var time = 0;
    var targetTime = 0;
    var scrollContainerEl = document.getElementById('scrolling-area-container');
    var videoContainerEl = document.getElementById('video-container');
    // var scrollEl = document.getElementById('scrolling-area');

    var videoReady = false;
    //
     var throttle = function(type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function() {
            // console.log('throttle', running);
            if (running) { return; }
            running = true;
            setTimeout(function () {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
                
            }, 100);

            // requestAnimationFrame(function() {
                // console.log('ok');
            // });
        };
        obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle ('scroll', 'optimizedScroll', scrollContainerEl);

    scrollContainerEl.addEventListener('optimizedScroll', function() {
        var pct = scrollContainerEl.scrollTop / (scrollContainerEl.scrollHeight - scrollContainerEl.clientHeight);
        targetTime = pct * videoPlayer.getDuration();
        // videoPlayer.setTimeAsPercent(pct, false);
        // videoPlayer.setTime(targetTime);
    });


    var baseSpeed = 0.02;
    var animationSpeed = baseSpeed;
    var maxSpeed = 0.1;
    var animate = function () {
        if (videoReady) {
            var timeMovement = (targetTime - time) / 4;

            if (timeMovement < -maxSpeed) {
                timeMovement = -maxSpeed;
            } else if (timeMovement > maxSpeed) {
                timeMovement = maxSpeed;
            }
            time += timeMovement;
            videoPlayer.setTime(time);
            // var newTime = videoPlayer.getTime() + animationSpeed;
            // videoPlayer.setTime(newTime);

            // if (newTime >= videoPlayer.getDuration()) {
            //     animationSpeed = -baseSpeed;
            // } else if (newTime <= 0) {
            //     animationSpeed = baseSpeed;
            // }

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

    requestAnimationFrame(animate);
    // var ScrollMagic = require('scrollmagic');

    // console.log(ScrollMagic);
    // // init controller
    // var controller = new ScrollMagic.Controller();
    // console.log(controller);
    // // create a scene
    // new ScrollMagic.Scene({
    //         duration: 100, // the scene should last for a scroll distance of 100px
    //         offset: 50 // start this scene after scrolling for 50px
    //     })
    //     .setPin('#my-sticky-element') // pins the element for the the scene's duration
    //     .addTo(controller); // assign the scene to the controller


})();