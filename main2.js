// global variables from the leap sample

var paused = false;
var pauseOnGesture = false;

var controllerOptions = { enableGestures: true };

// use to toggle the
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
	i: null,
	i2: null,
	prevFrame: null,

	init: function() {

		fingerSvgW = 500;
		fingerSvgH = 400;
		// get our d3 var
		fingerVis = d3.select('#finger-vis').selectAll('rect');
		//fingerVis.attr('width', (fingerSvgW / (5 + 0.5)))
		//	.attr('x', (fingerSvgW * ( 0.5)));
		
		$('#finger-vis .finger-bar').each( function() {
			console.log(k.i);
			k.i+=115;
			this.setAttribute('x', k.i);
		});

		fingerVis2 = d3.select('#finger-vis-2').selectAll('rect');
		//fingerVis.attr('width', (fingerSvgW / (5 + 0.5)))
		//	.attr('x', (fingerSvgW * ( 0.5)));
		
		$('#finger-vis-2 .finger-bar').each( function() {
			console.log(k.i2);
			k.i2+=115;
			this.setAttribute('x', k.i2);
		});

		// start our leap loop
		k.leapLoop();

	},	

	leapLoop: function() {



		 Leap.loop(controllerOptions, function(frame) {


		 	if (paused) {
				return; // Skip this update
			}
		 	
		 	k.prevFrame = frame;

		 });

		interval = setInterval( function() {

			//console.log( prevFrame );

			k.prepData( );

		}, 50);
		
	},

	prepData: function( ) {
		
		// here's the secret sauce
		fingerVis.data( this.prevFrame.hands[0].fingers )
			.transition()
			.attr('height', function(d) {
				return ( d.length * 4);
			})
			.attr('y', function(d) {
				return 400 - ( d.length * 4);
			})
			.attr('fill', function(d) {
				return 'rgb( ' + (d.tipVelocity[0] * 10) + ', ' + (d.tipVelocity[1] * 10) + ', ' + (d.tipVelocity[2] * 10) + ' )';
			});

		fingerVis2.data( this.prevFrame.hands[1].fingers )
			.transition()
			.attr('height', function(d) {
				return ( d.length * 4);
			})
			.attr('y', function(d) {
				return 400 - ( d.length * 4);
			})
			.attr('fill', function(d) {
				return 'rgb( ' + (d.tipVelocity[0] * 10) + ', ' + (d.tipVelocity[1] * 10) + ', ' + (d.tipVelocity[2] * 10) + ' )';
			});

	}
}