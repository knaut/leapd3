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
	fingerSvgH: null,
	fingerSvgW: null,

	init: function() {

		fingerSvgW = 500;
		fingerSvgH = 500;
		// get our d3 var
		fingerVis = d3.select('#finger-vis').selectAll('rect');
		fingerVis.attr('width', (fingerSvgW / (5 + 0.5)))
			.attr('x', (fingerSvgW * ( 0.5)));

		// start our leap loop
		k.leapLoop();

	},	

	leapLoop: function() {



		 Leap.loop(controllerOptions, function(frame) {


		 	if (paused) {
				return; // Skip this update
			}
		 	
		 	prevFrame = frame;

		 });

		interval = setInterval( function() {

			//console.log( prevFrame );

			k.prepData( prevFrame );

		}, 50);
		
	},

	prepData: function( frameData ) {

		thisFrameData = frameData;

		//console.log(thisFrameData);

		
		// here's the secret sauce
		fingerVis.data( thisFrameData.fingers )
			.transition()
			.attr('height', function(d) {
				return (d.length * 10);
			})
			.attr('y', function(d) {
				return ( k.fingerSvgH - (d.length * 8));
			})
			.attr('fill', function(d) {
				return 'rgb( ' + (d.tipVelocity[0] * 10) + ', ' + (d.tipVelocity[1] * 10) + ', ' + (d.tipVelocity[2] * 10) + ' )';
			});
		

	}
}