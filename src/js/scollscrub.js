  // var scrollContainerEl = document.getElementById('scrolling-area-container');
  //   var videoContainerEl = document.getElementById('video-container');
  //   // var scrollEl = document.getElementById('scrolling-area');

  //   //
  //    var throttle = function(type, name, obj) {
  //       obj = obj || window;
  //       var running = false;
  //       var func = function() {
  //           // console.log('throttle', running);
  //           if (running) { return; }
  //           running = true;
  //           setTimeout(function () {
  //               obj.dispatchEvent(new CustomEvent(name));
  //               running = false;
                
  //           }, 100);

  //           // requestAnimationFrame(function() {
  //               // console.log('ok');
  //           // });
  //       };
  //       obj.addEventListener(type, func);
  //   };

  //   /* init - you can init any event */
  //   throttle ('scroll', 'optimizedScroll', scrollContainerEl);

  //   scrollContainerEl.addEventListener('optimizedScroll', function() {
       
  //       var pct = scrollContainerEl.scrollTop / (scrollContainerEl.scrollHeight - scrollContainerEl.clientHeight);
  //       videoPlayer.setTimeAsPercent(pct, false);
   
  //   });