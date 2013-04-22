// Visualize our fingers
// * long row - bar graph for each finger, organized by Id
// 		- colored by hand
// 		- color saturation by speed
//		- bar height by finger length

// Store frame for motion functions
var previousFrame;
var paused = false;
var pauseOnGesture = false;

// Setup Leap loop with frame callback function
var controllerOptions = {enableGestures: true};

// create our obj
// k for kaunsole

var k = {

	init: function() {

		// there are five svg bars, one for each finger that (might?) appear.
		// we'll access that data from the pointable object, and bind
		// it to the svg bars with d3

		// simplify, simplify, simplify
		// for now, try binding per datum to discriminate elements
		// use the attributes to append and transition the data
		// use the obj model to filter and get the data you want

		/*
		var svgs = [
			'<svg id="finger-svg-1" class="finger-svg"></svg>', 
			'<svg id="finger-svg-2" class="finger-svg"></svg>', 
			'<svg id="finger-svg-3" class="finger-svg"></svg>', 
			'<svg id="finger-svg-4" class="finger-svg"></svg>', 
			'<svg id="finger-svg-5" class="finger-svg"></svg>' 
		];
		*/

		//testdata = [1, 2, 4, 8, 9, 10, 33, 66, 99];

		// get our visualizer container
		$fingerVis = $('#finger-vis');
			
		// append our elements
		//$fingerVis.append( svgs );

		// prep our vars for d3

		//$svgs = d3.select('#finger-vis').selectAll('rect');

		// spawn our finger svgs
		$finger1 = d3.select('#finger-vis').select('#finger-1');
		$finger2 = d3.select('#finger-vis').select('#finger-2');
		$finger3 = d3.select('#finger-vis').select('#finger-3');
		$finger4 = d3.select('#finger-vis').select('#finger-4');
		$finger5 = d3.select('#finger-vis').select('#finger-5');
		
	},

	update: function( leap ) {

		//console.log( leap );

		//console.log("updating");

		var thisLeap = leap;

		// finger 1
		$finger1.transition().attr('height', function() {
			
			// if there's a pointable in range & it's not a tool
			if ( thisLeap.pointables[0] && !thisLeap.pointables[0].isTool ) {

				//console.log( Math.floor( thisLeap.pointables[0].length ) );

				// return it's length in pixels
				return Math.floor( thisLeap.pointables[0].length ) + 'px';
			}

		});

		// finger 2
		$finger2.transition().attr('height', function() {
			
			// if there's a pointable in range & it's not a tool
			if ( thisLeap.pointables[1] && !thisLeap.pointables[0].isTool ) {

				//console.log( Math.floor( thisLeap.pointables[0].length ) );

				// return it's length in pixels
				return Math.floor( thisLeap.pointables[0].length ) + 'px';
			}

		});

		// finger 3
		$finger3.transition().attr('height', function() {
			
			// if there's a pointable in range & it's not a tool
			if ( thisLeap.pointables[2] && !thisLeap.pointables[0].isTool ) {

				//console.log( Math.floor( thisLeap.pointables[0].length ) );

				// return it's length in pixels
				return Math.floor( thisLeap.pointables[0].length ) + 'px';
			}

		});

		// finger 4
		$finger4.transition().attr('height', function() {
			
			// if there's a pointable in range & it's not a tool
			if ( thisLeap.pointables[3] && !thisLeap.pointables[0].isTool ) {

				//console.log( Math.floor( thisLeap.pointables[0].length ) );

				// return it's length in pixels
				return Math.floor( thisLeap.pointables[0].length ) + 'px';
			}

		});

		// finger 5
		$finger5.transition().attr('height', function() {
			
			// if there's a pointable in range & it's not a tool
			if ( thisLeap.pointables[4] && !thisLeap.pointables[0].isTool ) {

				//console.log( Math.floor( thisLeap.pointables[0].length ) );

				// return it's length in pixels
				return Math.floor( thisLeap.pointables[0].length ) + 'px';
			}

		});
	}

};


// define leap
leap = null;


// Enter the leap loop
Leap.loop(controllerOptions, function(frame) {

	leap = frame.data;

  if (paused) {
	return; // Skip this update
  }

	k.update( leap );

  // Display Frame object data
  var frameOutput = document.getElementById("frame-data");

  var frameString = "Frame ID: " + frame.id  + "<br />"
				  + "Timestamp: " + frame.timestamp + " &micro;s<br />"
				  + "Hands: " + frame.hands.length + "<br />"
				  + "Fingers: " + frame.fingers.length + "<br />"
				  + "Tools: " + frame.tools.length + "<br />"
				  + "Gestures: " + frame.gestures.length + "<br />";

  // Frame motion factors
  if (previousFrame) {
	var translation = frame.translation(previousFrame);
	frameString += "Translation: " + vectorToString(translation) + " mm <br />";

	var rotationAxis = frame.rotationAxis(previousFrame);
	var rotationAngle = frame.rotationAngle(previousFrame);
	frameString += "Rotation axis: " + vectorToString(rotationAxis, 2) + "<br />";
	frameString += "Rotation angle: " + rotationAngle.toFixed(2) + " radians<br />";

	var scaleFactor = frame.scaleFactor(previousFrame);
	frameString += "Scale factor: " + scaleFactor.toFixed(2) + "<br />";
  }
  //frameOutput.innerHTML = "<div style='width:300px; float:left; padding:5px'>" + frameString + "</div>";

  // Display Hand object data
  var handOutput = document.getElementById("hand-data");
  var handString = "";
  if (frame.hands.length > 0) {
	for (var i = 0; i < frame.hands.length; i++) {
	  var hand = frame.hands[i];

	  handString += "<div style='width:300px; float:left; padding:5px'>";
	  handString += "Hand ID: " + hand.id + "<br />";
	  handString += "Direction: " + vectorToString(hand.direction, 2) + "<br />";
	  handString += "Palm normal: " + vectorToString(hand.palmNormal, 2) + "<br />";
	  handString += "Palm position: " + vectorToString(hand.palmPosition) + " mm<br />";
	  handString += "Palm velocity: " + vectorToString(hand.palmVelocity) + " mm/s<br />";
	  handString += "Sphere center: " + vectorToString(hand.sphereCenter) + " mm<br />";
	  handString += "Sphere radius: " + hand.sphereRadius.toFixed(1) + " mm<br />";

	  // Hand motion factors
	  if (previousFrame) {
		var translation = hand.translation(previousFrame);
		handString += "Translation: " + vectorToString(translation) + " mm<br />";

		var rotationAxis = hand.rotationAxis(previousFrame, 2);
		var rotationAngle = hand.rotationAngle(previousFrame);
		handString += "Rotation axis: " + vectorToString(rotationAxis) + "<br />";
		handString += "Rotation angle: " + rotationAngle.toFixed(2) + " radians<br />";

		var scaleFactor = hand.scaleFactor(previousFrame);
		handString += "Scale factor: " + scaleFactor.toFixed(2) + "<br />";
	  }

	  // IDs of pointables (fingers and tools) associated with this hand
	  if (hand.pointables.length > 0) {
		var fingerIds = [];
		var toolIds = [];
		for (var j = 0; j < hand.pointables.length; j++) {
		  var pointable = hand.pointables[j];
		  if (pointable.tool) {
			toolIds.push(pointable.id);
		  }
		  else {
			fingerIds.push(pointable.id);
		  }
		}
		if (fingerIds.length > 0) {
		  handString += "Fingers IDs: " + fingerIds.join(", ") + "<br />";
		}
		if (toolIds.length > 0) {
		  handString += "Tools IDs: " + toolIds.join(", ") + "<br />";
		}
	  }

	  handString += "</div>";
	}
  }
  else {
	handString += "No hands";
  }
  //handOutput.innerHTML = handString;

  // Display Pointable (finger and tool) object data
  var pointableOutput = document.getElementById("pointable-data");
  var pointableString = "";
  if (frame.pointables.length > 0) {
	for (var i = 0; i < frame.pointables.length; i++) {
	  var pointable = frame.pointables[i];

	  pointableString += "<div style='width:250px; float:left; padding:5px'>";
	  pointableString += "Pointable ID: " + pointable.id + "<br />";
	  pointableString += "Belongs to hand with ID: " + pointable.handId + "<br />";

	  if (pointable.tool) {
		pointableString += "Classified as a tool <br />";
		pointableString += "Length: " + pointable.length.toFixed(1) + " mm<br />";
		pointableString += "Width: "  + pointable.width.toFixed(1) + " mm<br />";
	  }
	  else {
		pointableString += "Classified as a finger<br />";
		pointableString += "Length: " + pointable.length.toFixed(1) + " mm<br />";
	  }

	  pointableString += "Direction: " + vectorToString(pointable.direction, 2) + "<br />";
	  pointableString += "Tip position: " + vectorToString(pointable.tipPosition) + " mm<br />";
	  pointableString += "Tip velocity: " + vectorToString(pointable.tipVelocity) + " mm/s<br />";

	  pointableString += "</div>";
	}
  }
  else {
	pointableString += "<div>No pointables</div>";
  }
  pointableOutput.innerHTML = pointableString;

  // Display Gesture object data
  var gestureOutput = document.getElementById("gesture-data");
  var gestureString = "";
  if (frame.gestures.length > 0) {
	if (pauseOnGesture) {
	  togglePause();
	}
	for (var i = 0; i < frame.gestures.length; i++) {
	  var gesture = frame.gestures[i];
	  gestureString += "Gesture ID: " + gesture.id + ", "
					+ "type: " + gesture.type + ", "
					+ "state: " + gesture.state + ", "
					+ "hand IDs: " + gesture.handIds.join(", ") + ", "
					+ "pointable IDs: " + gesture.pointableIds.join(", ") + ", "
					+ "duration: " + gesture.duration + " &micro;s, ";

	  switch (gesture.type) {
		case "circle":
		  gestureString += "center: " + vectorToString(gesture.center) + " mm, "
						+ "normal: " + vectorToString(gesture.normal, 2) + ", "
						+ "radius: " + gesture.radius.toFixed(1) + " mm, "
						+ "progress: " + gesture.progress.toFixed(2) + " rotations";
		  break;
		case "swipe":
		  gestureString += "start position: " + vectorToString(gesture.startPosition) + " mm, "
						+ "current position: " + vectorToString(gesture.position) + " mm, "
						+ "direction: " + vectorToString(gesture.direction, 2) + ", "
						+ "speed: " + gesture.speed.toFixed(1) + " mm/s";
		  break;
		case "screenTap":
		case "keyTap":
		  gestureString += "position: " + vectorToString(gesture.position) + " mm, "
						+ "direction: " + vectorToString(gesture.direction, 2);
		  break;
		default:
		  gestureString += "unkown gesture type";
	  }
	  gestureString += "<br />";
	}
  }
  else {
	gestureString += "No gestures";
  }
  gestureOutput.innerHTML = gestureString;

  // Store frame for motion functions
  previousFrame = frame;
})

function vectorToString(vector, digits) {
  if (typeof digits === "undefined") {
	digits = 1;
  }
  return "(" + vector[0].toFixed(digits) + ", "
			 + vector[1].toFixed(digits) + ", "
			 + vector[2].toFixed(digits) + ")";
}

function togglePause() {
  paused = !paused;

  if (paused) {
	document.getElementById("pause").innerText = "Resume";
  } else {
	document.getElementById("pause").innerText = "Pause";
  }
}

function pauseForGestures() {
  if (document.getElementById("pauseOnGesture").checked) {
	pauseOnGesture = true;
  } else {
	pauseOnGesture = false;
  }
}

function checkLibrary() {
  if (typeof Leap === "undefined") {
	document.getElementById("main").innerHTML = "The Leap JavaScript client library (leap.js file) was not found. Please download the library from the GitHub project at <a href='https://github.com/leapmotion/leapjs'>https://github.com/leapmotion/leapjs</a>."
	alert("The Leap JavaScript client library (leap.js file) was not found. Please download the latest version from the GitHub project at https://github.com/leapmotion/leapjs");
  }
}