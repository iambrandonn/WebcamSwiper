/*global Modernizr */

// Determine which transition event to listen for if supported
var transitions = {
	'transition':'transitionend',
	'OTransition':'oTransitionEnd',
	'MSTransition':'msTransitionEnd',
	'MozTransition':'transitionend',
	'WebkitTransition':'webkitTransitionEnd'
};
window.transitionEvent = transitions[Modernizr.prefixed('transition')];
window.transitionStyle = Modernizr.prefixed('transition').replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');
window.transformStyle = Modernizr.prefixed('transform').replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');

var isMoving = false;

// Firefox
if ($.browser.mozilla && +($.browser.version) < 20) {
	$(".instructions").css("color", "red");
	$(".instructions").text('In order for this page to work in Firefox version 19 or lower you will need to go to about:config and turn on the media.navigator.enabled flag.');
}
else if (navigator.getUserMedia === undefined) {
	$(".instructions").css("color", "red");
	if (!Modernizr.csstransforms3d) {
		$(".instructions").text("Your browser/hardware doesn't support hardware accelerated 3D CSS. The page may not work well.  Your browser also doesn't support getUserMedia().  Try using the latest version of Chrome or Firefox 20+.");
	}
	else {
		$(".instructions").text("Your browser doesn't support getUserMedia().  Try using the latest version of Chrome or Firefox 20+.");
	}
}
else if (!Modernizr.csstransforms3d) {
	$(".instructions").css("color", "red");
	$(".instructions").text("Your browser/hardware doesn't support hardware accelerated 3D CSS. The page may not work well.");
}

$(function() {
	// Hook up the buttons
	$(".left").click(previous);
	$(".right").click(next);

	$(".book").height($(".book").width() * 0.75);

	$(window).resize(function() {
		$(".book").height($(".book").width() * 0.75);
	});
});

// document.getElementsByTagName("body")[0].addEventListener("webcamSwipeLeft", next, true);
// document.getElementsByTagName("body")[0].addEventListener("webcamSwipeRight", previous, true);
$("body").bind("webcamSwipeLeft", next);
$("body").bind("webcamSwipeRight", previous);

function next() {
	if (!isMoving) {
		isMoving = true;

		// Add a listener so we can clean up after the transition has completed
		$(".five")[0].addEventListener(window.transitionEvent, afterNextPageShowing, true);

		// Apply the styles to create the "page turn" effect
		var newStyles = {};
		newStyles[window.transitionStyle] = window.transformStyle + " 1s cubic-bezier(0.09,0.25,0.00,1.00)";
		$(".five, .six").css(newStyles);
		$(".five").css(window.transformStyle, "rotateY(-180deg)");
		$(".four").css("z-index", "16");
		var moreNewStyles = {
			"z-index": "18"
		};
		moreNewStyles[window.transformStyle] = "rotateY(0deg)";
		$(".six").css(moreNewStyles);
	}
}

function afterNextPageShowing() {
	$(".five")[0].removeEventListener(window.transitionEvent, afterNextPageShowing, true);

	// Clean up styles
	var newStyles = {};
	newStyles[window.transitionStyle] = "";
	newStyles[window.transformStyle] = "";
	$(".five, .six").css(newStyles);
	$(".four, .six").css("z-index", "");

	// move extra pages to end so we can move infintely either direction
	$(".book").append($(".one"));
	$(".book").append($(".two"));

	reAssignPageNumbers();

	// We're done, more events can be processed now
	isMoving = false;
}

function previous() {
	if (!isMoving) {
		isMoving = true;

		// Add a listener so we can clean up after the transition has completed
		$(".four")[0].addEventListener(window.transitionEvent, afterPreviousPageShowing, true);

		// Apply the styles to create the "page turn" effect
		var newStyles = {};
		newStyles[window.transitionStyle] = window.transformStyle + " 1s cubic-bezier(0.09,0.25,0.00,1.00)";
		$(".four, .three").css(newStyles);
		$(".four").css(window.transformStyle, "rotateY(180deg)");
		$(".five").css("z-index", "15");
		var moreNewStyles = {
			"z-index": "17"
		};
		moreNewStyles[window.transformStyle] = "rotateY(0deg)";
		$(".three").css(moreNewStyles);
	}
}

function afterPreviousPageShowing() {
	$(".four")[0].removeEventListener(window.transitionEvent, afterPreviousPageShowing, true);

	// Clean up styles
	var newStyles = {};
	newStyles[window.transitionStyle] = "";
	newStyles[window.transformStyle] = "";
	$(".four, .three").css(newStyles);
	$(".five, .three").css("z-index", "");

	// move extra pages to beginning so we can move infintely either direction
	$(".book").prepend($(".eight"));
	$(".book").prepend($(".seven"));

	reAssignPageNumbers();

	// We're done, more events can be processed now
	isMoving = false;
}

function reAssignPageNumbers() {
	$(".one, .two, .three, .four, .five, .six, .seven, .eight").removeClass("one two three four five six seven eight");
	$(".book > div")[0].classList.add("one");
	$(".book > div")[1].classList.add("two");
	$(".book > div")[2].classList.add("three");
	$(".book > div")[3].classList.add("four");
	$(".book > div")[4].classList.add("five");
	$(".book > div")[5].classList.add("six");
	$(".book > div")[6].classList.add("seven");
	$(".book > div")[7].classList.add("eight");
}

window.initializeWebcamSwiper();