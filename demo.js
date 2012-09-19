/*global Modernizr */

// Determine which transition event to listen for if supported
var transitions = {
	'transition':'transitionEnd',
	'OTransition':'oTransitionEnd',
	'MSTransition':'msTransitionEnd',
	'MozTransition':'transitionend',
	'WebkitTransition':'webkitTransitionEnd'
};
window.transitionEvent = transitions[Modernizr.prefixed('transition')];
window.transitionStyle = Modernizr.prefixed('transition').replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');
window.transformStyle = Modernizr.prefixed('transform').replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');

var allPics = $(".allPics");
var isMoving = false;

$(function() {
	$(".left").click(previous);
	$(".right").click(next);
});

function afterNextPageShowing() {
	$(".five")[0].removeEventListener(window.transitionEvent, afterNextPageShowing, true);

	var newStyles = {};
	newStyles[window.transitionStyle] = "";
	newStyles[window.transformStyle] = "";
	$(".five, .six").css(newStyles);

	$(".four, .six").css("z-index", "");

	// move extra pages to end
	$(".book").append($(".one"));
	$(".book").append($(".two"));
 
	$(".one").removeClass("one");
	$(".two").removeClass("two");
	$(".three").removeClass("three");
	$(".four").removeClass("four");
	$(".five").removeClass("five");
	$(".six").removeClass("six");
	$(".seven").removeClass("seven");
	$(".eight").removeClass("eight");

	$(".book > div")[0].classList.add("one");
	$(".book > div")[1].classList.add("two");
	$(".book > div")[2].classList.add("three");
	$(".book > div")[3].classList.add("four");
	$(".book > div")[4].classList.add("five");
	$(".book > div")[5].classList.add("six");
	$(".book > div")[6].classList.add("seven");
	$(".book > div")[7].classList.add("eight");

	isMoving = false;
}

function afterPreviousPageShowing() {
	$(".four")[0].removeEventListener(window.transitionEvent, afterPreviousPageShowing, true);

	var newStyles = {};
	newStyles[window.transitionStyle] = "";
	newStyles[window.transformStyle] = "";
	$(".four, .three").css(newStyles);

	$(".five, .three").css("z-index", "");

	// move extra pages to beginning
	$(".book").prepend($(".eight"));
	$(".book").prepend($(".seven"));
	$(".one").removeClass("one");
	$(".two").removeClass("two");
	$(".three").removeClass("three");
	$(".four").removeClass("four");
	$(".five").removeClass("five");
	$(".six").removeClass("six");
	$(".seven").removeClass("seven");
	$(".eight").removeClass("eight");

	$(".book > div")[0].classList.add("one");
	$(".book > div")[1].classList.add("two");
	$(".book > div")[2].classList.add("three");
	$(".book > div")[3].classList.add("four");
	$(".book > div")[4].classList.add("five");
	$(".book > div")[5].classList.add("six");
	$(".book > div")[6].classList.add("seven");
	$(".book > div")[7].classList.add("eight");
	isMoving = false;
}

function next() {
	if (!isMoving) {
		isMoving = true;

		if (window.transitionEvent !== undefined) {
			$(".five")[0].addEventListener(window.transitionEvent, afterNextPageShowing, true);
		}
		else {
			afterNextPageShowing();
		}

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

function previous() {
	if (!isMoving) {
		isMoving = true;

		if (window.transitionEvent !== undefined) {
			$(".four")[0].addEventListener(window.transitionEvent, afterPreviousPageShowing, true);
		}
		else {
			afterPreviousPageShowing();
		}

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
