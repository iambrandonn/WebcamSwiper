var PIXEL_CHANGE_THRESHOLD = 30;
var FRAME_THRESHOLD = 30000;
var greyscaleCtx = $("#cnvs")[0].getContext("2d");
var deltasCtx = $("#deltas")[0].getContext("2d");
var previousImageData;
var currentImageData = deltasCtx.createImageData(320, 240);

var originalWeight = 0;
var currentWeight = 0;
var horizontalResolution;
var verticalResolution;
var isActive = false;
var remainingFrames = 8;

navigator.webkitGetUserMedia({video: true}, function(stream) {
	var video = $("video")[0];
	video.src = window.webkitURL.createObjectURL(stream);

	setTimeout(function() {
		$("input").click(function() {
			stream.stop();
			clearInterval(refreshInterval);
		});

		horizontalResolution = video.videoWidth;
		verticalResolution = video.videoHeight;

		// if we see a frame above the frame threshold...

		var refreshInterval = setInterval(function() {
			greyscaleCtx.drawImage(video, 0, 0, horizontalResolution, verticalResolution, 0, 0, horizontalResolution / 2, verticalResolution / 2);
			previousImageData = currentImageData;
			currentImageData = deSaturate(greyscaleCtx.getImageData(0, 0, horizontalResolution / 2, verticalResolution / 2));
			greyscaleCtx.putImageData(currentImageData, 0, 0);

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
							previous();
							isActive = false;
						}
					}
					else {
						if (currentWeight > FRAME_THRESHOLD) {
							next();
							isActive = false;
						}
					}
				}
			}
		}, 1000/15);
	}, 1000);
});

function getDeltas(previous, current) {
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

	console.log(currentWeight);
	return deltas;
}

function deSaturate(imageData) {
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
}