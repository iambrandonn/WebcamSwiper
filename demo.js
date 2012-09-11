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

$(function() {
	$(".left").click(previous);
	$(".right").click(next);
});

function afterSlideLeft() {
	allPics[0].removeEventListener(window.transitionEvent, afterSlideLeft, true);

	var oldOne = $(".pic").first().remove();
	allPics.append("<div class='pic'>" + (parseInt(oldOne.text(), 10) + 3) + "</div>");

	var newStyles = {};
	newStyles[Modernizr.prefixed('transition')] = "";
	newStyles[Modernizr.prefixed('transform')] = "translateX(-800px)";
	allPics.css(newStyles);
}

function afterSlideRight() {
	allPics[0].removeEventListener(window.transitionEvent, afterSlideRight, true);

	var oldOne = $(".pic").last().remove();
	allPics.prepend("<div class='pic'>" + (parseInt(oldOne.text(), 10) - 3) + "</div>");

	var newStyles = {};
	newStyles[Modernizr.prefixed('transition')] = "";
	newStyles[Modernizr.prefixed('transform')] = "translateX(-800px)";
	allPics.css(newStyles);
}

function next() {
	if (window.transitionEvent !== undefined) {
		allPics[0].addEventListener(window.transitionEvent, afterSlideLeft, true);
	}
	else {
		afterSlideLeft();
	}

	var newStyles = {};
	newStyles[Modernizr.prefixed('transition')] = "all .7s";
	newStyles[Modernizr.prefixed('transform')] = "translateX(-1600px)";
	allPics.css(newStyles);
}

function previous() {
	if (window.transitionEvent !== undefined) {
		allPics[0].addEventListener(window.transitionEvent, afterSlideRight, true);
	}
	else {
		afterSlideRight();
	}

	var newStyles = {};
	newStyles[Modernizr.prefixed('transition')] = "all .7s";
	newStyles[Modernizr.prefixed('transform')] = "translateX(0px)";
	allPics.css(newStyles);
}
