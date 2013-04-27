// new version of the same program

/* on init
	- append finger panels (finger panels -2 )
	- build out svgs(2) and rects (5 each)
	- set ids and classes
	- set attributes width, height, fill, x, y
	- fire leap loop

* on leap loop
	- pass in loop parameters
	- set snapshot updater

* on update
	- bind data to svgs using d3

• achieve no erros

then…

- set config options for finger bars
	- set x, y, z, to be recieve data (r,g,b) on trigger "on"
	- set finger bar height to be finger lenth, or palm y dist from origin
*/



// global variables from the leap sample
var paused = false;
var pauseOnGesture = false;

var controllerOptions = { enableGestures: true };

// our main program
var main = {

	// decs
	$firstHandSVG: null,
	$secondHandSVG: null,
	$firstHandBars: null,
	$secondHandBars: null,

	fingerSVGH: 400,
	fbarH: 10,			// minimum height
	fbarW: 75,
	fbarFill: '#3C3F40',
	lastFrame: null,
	lastFrameHands: null,

	// declare our prototype objects

	// initialize
	init: function() {

		$firstHandSVG = d3.select('#first-hand svg');
		$firstHandBars = $firstHandSVG.selectAll('rect');

		$secondHandSVG = d3.select('#second-hand svg');
		$secondHandBars = $secondHandSVG.selectAll('rect');

		// set the x offsets
		var xOffset = 100;

		$('#first-hand .finger-bar').each( function(index) {
			// we offset their x by multiplying their index
			// by some arbitrary distance
			index *= xOffset;
			this.setAttribute('x', index);
		});

		$('#second-hand .finger-bar').each( function(index) {
			// we offset their x by multiplying their index
			// by some arbitrary distance
			index *= xOffset;
			index += 100; // compensation for lack of right-side alignment
			this.setAttribute('x', index);
		});

		// start the leap loop
		this.leapLoop( 100 );

		// setup the ui
		ui.setup();
		
	},

	// main program functions
	leapLoop: function( interval ) { 	

		// we set an interval to catch our data
		var thisInterval = interval;

		Leap.loop(controllerOptions, function(frame) {

		 	if (paused) {
				return; // Skip this update
			}
		 	
		 	main.lastFrame = frame;	// save this frame

		});

		// we update on an interval 
		this.leapInterval = setInterval( function() {

			// check theres a hand
			main.update();	

		}, thisInterval);
	},

	update: function() {

		// on the first fire, the frame hasn't been stored yet.
		// this creates the first error.

		if ( this.lastFrame.hands[0] ) {

			$firstHandBars.data( this.lastFrame.hands[0].fingers ).transition()
				.attr('height', function(d) {
					return ( d.length.toFixed(1) * 4);
				})
				.attr('y', function(d) {
					return 400 - ( d.length.toFixed(1) * 4);
				})
				.attr('fill', function(d) {
					return 'rgb( ' + (d.tipVelocity[0] * 10) + ', ' + (d.tipVelocity[1] * 10) + ', ' + (d.tipVelocity[2] * 10) + ' )';
				});
		
		}

		if ( this.lastFrame.hands[1] ) {

			$secondHandBars.data( this.lastFrame.hands[1].fingers ).transition()
				.attr('height', function(d) {
					return ( d.length.toFixed(1) * 4);
				})
				.attr('y', function(d) {
					return 400 - ( d.length.toFixed(1) * 4);
				})
				.attr('fill', function(d) {
					return 'rgb( ' + (d.tipVelocity[0] * 10) + ', ' + (d.tipVelocity[1] * 10) + ', ' + (d.tipVelocity[2] * 10) + ' )';
				});
		
		}	
	}
}

// ui object

var ui = {
	$leftDrawer: null,
	$leftDrawerTog: null,

	// set up the ui
	setup: function() {

		console.log("setting up the ui");

		this.$leftDrawer = $('#left');
		this.$leftDrawerToggle = $('button[data-ui="toggle"][href="#left"]');

		// click handler
		this.$leftDrawerToggle.bind( 'click', function() {

			ui.leftDrawerEvent();

		});

		// buttons

	},

	leftDrawerEvent: function() {

		if ( !this.$leftDrawer.hasClass('anim-toggled') ) {

			// the drawer isn't toggled. let's open it and bind its ui elements
			this.$leftDrawer.addClass('anim-toggled');
			this.$leftDrawerToggle.attr('data-ui-state', 'toggled');

			// hook .btn class
			this.$leftDrawer.find('.btn').each( function() {

				// bind the click handler to each item
				$(this).bind( 'click', function() {

					// call click handler, and give it the clicked elem
					ui.clickHandler( this )
				});
			});

		} else {

			// it did have the class, so it was toggled.
			// unbind its elements and close it.
			ui.$leftDrawer.removeClass('anim-toggled');
			this.$leftDrawerToggle.attr('data-ui-state', '');

			this.$leftDrawer.find('.btn').each( function() {

				// bind the click handler to each item
				$(this).unbind( 'click' );
			});

		}
		
		
	},

	clickHandler: function( elem ) {

		var $thisButton = $( elem );

		console.log($thisButton[0]);
		console.log( this );

	},
}