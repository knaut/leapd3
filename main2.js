var prevFrame;
var paused = false;
var pauseOnGesture = false;

var controllerOptions = { enableGestures: true };

function togglePause() {
  paused = !paused;

  if (paused) {
	document.getElementById("pause").innerText = "Resume";
  } else {
	document.getElementById("pause").innerText = "Pause";
  }
}

// program

var fingerLengths = [];

var k = {
	fingerVis: null,

	init: function() {

		fingerVis = d3.select('#finger-vis').selectAll('rect');

		// start our leap loop
		k.leapLoop();

	},

	prepData: function( frameData ) {

		thisFrameData = frameData;

		// here's the secret sauce
		fingerVis.data( thisFrameData.fingers )
			.attr('height', function(d) {
				return d.length;
			});
		
		for ( i = 0; i < thisFrameData.fingers.length; i++ ) {

			//console.log( thisFrameData.fingers[i] );

			//console.log( 'how many fingers: ' + thisFrameData.fingers.length );

			
		}
	},

	leapLoop: function() {



		 Leap.loop(controllerOptions, function(frame) {


		 	if (paused) {
				return; // Skip this update
			}
		 	
		 	prevFrame = frame;

		 });

		interval = setInterval( function() {

			console.log( prevFrame );

			k.prepData( prevFrame );

		}, 1000);
		
	}
}