var prevFrame;
var paused = false;
var pauseOnGesture = false;

var controllerOptions = { enableGestures: true };

var k = {

	init: function() {

		// start our leap loop
		k.leapLoop();

	},

	prepData: function( frameData ) {

		thisFrameData = frameData;

		for ( i = 0; i < thisFrameData.fingers.length; i++ ) {

			thisFrameData.fingers.filter( function(el) {
				

					console.log( 'el.length: ' + el.length );
					return el.length;
				
				
			});
		}
	},

	leapLoop: function() {

		 Leap.loop(controllerOptions, function(frame) {

		 	k.prepData( frame );

		 	// save the frame
		 	prevFrame = frame;

		 });
	}
}