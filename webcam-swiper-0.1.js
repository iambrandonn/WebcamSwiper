// If jQuery is available, register as a plugin
if (jQuery !== undefined) {
	(function( $ ){
		$.webcamSwipeLeft = function(theHandler) {
			$("body").bind("webcamSwipeLeft", theHandler);
			return $;
		};
		$.webcamSwipeRight = function(theHandler) {
			$("body").bind("webcamSwipeRight", theHandler);
			return $;
		};
	})( jQuery );
}


if (navigator.getUserMedia !== undefined) {
	navigator.getUserMedia({video: true}, processWebcamStream);
}
else if (navigator.webkitGetUserMedia !== undefined) {
	navigator.webkitGetUserMedia({video: true}, processWebcamStream);
}

function processWebcamStream (stream) {
	var PIXEL_CHANGE_THRESHOLD = 30;
	var FRAME_THRESHOLD = 30000;
	var greyscaleCtx = document.getElementById("cnvs").getContext("2d");
	var deltasCtx = document.getElementById("deltas").getContext("2d");
	var previousImageData;
	var currentImageData = deltasCtx.createImageData(320, 240);

	var originalWeight = 0;
	var currentWeight = 0;
	var horizontalResolution;
	var verticalResolution;
	var isActive = false;
	var remainingFrames = 8;

	var deSaturate = function(imageData) {
		var newImageData = greyscaleCtx.createImageData(imageData);
		var theData = imageData.data;
		var newData = newImageData.data;
		var dataLength = theData.length;
		for (var i = 0; i < dataLength; i += 4) {
			var average = (theData[i] + theData[i + 1] + theData[i + 2]) / 3;
			newData[i] = newData[i+1] = newData[i+2] = average;
			newData[i+3] = 255;
		}

		return newImageData;
	};

	var getDeltas = function(previous, current) {
		currentWeight = 0;
		var deltas = deltasCtx.createImageData(previous);

		var previousData = previous.data;
		var currentData = current.data;
		var dataLength = previousData.length;
		var deltasData = deltas.data;
		for (var i = 0; i < dataLength; i += 4) {
			if (Math.abs(previousData[i] - currentData[i]) > PIXEL_CHANGE_THRESHOLD) {
				var pixelPlace = ((i / 4) % horizontalResolution) - (horizontalResolution / 2);
				currentWeight += pixelPlace;
				deltasData[i] = deltasData[i+1] = deltasData[i+2] = 255;
			}
			deltasData[i+3] = 255;
		}

		//	console.log(currentWeight);
		return deltas;
	};

	// Create a video element and set its source to the stream from the webcam
	var videoElement = document.createElement("video");
	videoElement.style.display = "none";
	videoElement.autoplay = true;
	document.getElementsByTagName("body")[0].appendChild(videoElement);
	videoElement.src = window.webkitURL.createObjectURL(stream);

	// Wait for the video element to initialize
	setTimeout(function() {
		// Now that the video element has been initialized, determine the webcam resolution from it
		horizontalResolution = videoElement.videoWidth;
		verticalResolution = videoElement.videoHeight;

		// every 15th of a second, sample the video stream
		setInterval(function() {
			// Desaturate the image
			greyscaleCtx.drawImage(videoElement, 0, 0, horizontalResolution, verticalResolution, 0, 0, horizontalResolution / 2, verticalResolution / 2);
			previousImageData = currentImageData;
			currentImageData = deSaturate(greyscaleCtx.getImageData(0, 0, horizontalResolution / 2, verticalResolution / 2));
			greyscaleCtx.putImageData(currentImageData, 0, 0);

			// Map the pixels that are changing
			deltasCtx.putImageData(getDeltas(previousImageData, currentImageData), 0, 0);

			if (!isActive) {
				if (Math.abs(currentWeight) > FRAME_THRESHOLD) {
					isActive = true;
					remainingFrames = 8;
					originalWeight = currentWeight;
				}
			}
			if (isActive) {
				if (remainingFrames <= 0) {
					isActive = false;
				}
				else {
					remainingFrames--;
					if (originalWeight > 0) {
						if (currentWeight < -FRAME_THRESHOLD) {
							var swipeRightEvent = document.createEvent("UIEvents");
							swipeRightEvent.initEvent("webcamSwipeRight", false, false);
							document.getElementsByTagName("body")[0].dispatchEvent(swipeRightEvent);
							isActive = false;
						}
					}
					else {
						if (currentWeight > FRAME_THRESHOLD) {
							var swipeLeftEvent = document.createEvent("UIEvents");
							swipeLeftEvent.initEvent("webcamSwipeLeft", false, false);
							document.getElementsByTagName("body")[0].dispatchEvent(swipeLeftEvent);
							isActive = false;
						}
					}
				}
			}
		}, 1000/15);
	}, 1000);
}