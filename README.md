WebcamSwiper
============

An experiment/hack using getUserMedia to watch for swipes left and right with a hand.  This could be applied to many different uses.  Flipping through pictures in an image carousel, moving to the next item in a list, flipping pages of a book or magazine, etc.

[Demo](http://iambrandonn.github.com/WebcamSwiper)

[Blog Post](http://tripleequals.blogspot.com/2012/09/webcam-swiper.html)

Usage
-----
Two custom events are added to the body tag by the library.  You need to bind callbacks to these events and initialize the library.  If desired you can stop the library with the destroy method as well.

1. Include the webcam-swiper-0.1.js with a script tag or the loader of your choice.

2. Bind the swipe events however you choose.  Example with jQuery:

  `$("body").bind("webcamSwipeLeft", yourLeftEventHandler);
  $("body").bind("webcamSwipeRight", yourRightEventHandler);`

3. Start the webcam access with a call to the global initializeWebcamSwiper function like this:

  `window.initializeWebcamSwiper();`

4. Now it is running!  If you choose to stop it call

  `window.destroyWebcamSwiper();`