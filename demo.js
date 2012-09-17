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

var allPics = $(".allPics");
var isMoving = false;

$(function() {
	$(".left").click(previous);
	$(".right").click(next);
});

function afterSlideLeft() {
	allPics[0].removeEventListener(window.transitionEvent, afterSlideLeft, true);

	var oldOne = $(".pic").first().remove();
	allPics.append("<div class='pic next'>" + (parseInt(oldOne.text(), 10) + 3) + "</div>");

	isMoving = false;
}

function afterSlideRight() {
	allPics[0].removeEventListener(window.transitionEvent, afterSlideRight, true);

	var oldOne = $(".pic").last().remove();
	allPics.prepend("<div class='pic previous'>" + (parseInt(oldOne.text(), 10) - 3) + "</div>");

	isMoving = false;
}

function next() {
	if (!isMoving) {
		isMoving = true;

		if (window.transitionEvent !== undefined) {
			allPics[0].addEventListener(window.transitionEvent, afterSlideLeft, true);
		}
		else {
			afterSlideLeft();
		}

		var current = $(".current")[0];
		var nextPic = $(".next")[0];
		current.classList.add("previous");
		current.classList.remove("current");
		nextPic.classList.add("current");
		nextPic.classList.remove("next");
	}
}

function previous() {
	if (!isMoving) {
		isMoving = true;

		if (window.transitionEvent !== undefined) {
			allPics[0].addEventListener(window.transitionEvent, afterSlideRight, true);
		}
		else {
			afterSlideRight();
		}

		var current = $(".current")[0];
		var previousPic = $(".previous")[0];
		current.classList.add("next");
		current.classList.remove("current");
		previousPic.classList.add("current");
		previousPic.classList.remove("previous");
	}
}
