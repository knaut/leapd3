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

// sugar
// do you like your strings camelized?
// hey baby, can i camelize your strings?
// hey sugar, want those string camel'd?	// this method gave me <5 pickup line ideas
String.prototype.camelize = function () {
    return this.replace (/(?:^|[-_])(\w)/g, function (_, c) {
      return c ? c.toUpperCase () : '';
    })
};




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

	// our data filter obj
	dataFilter: {},

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

		// here we just check that the hand is visible
		if ( this.lastFrame.hands[0] ) {

			// bind the data, which must be some kind of array
			$firstHandBars.data( this.lastFrame.hands[0].fingers ).transition()

				// animate bar height
				.attr('height', function(d) {
					if (main.dataFilter.length === "active" ) {  
						return d.length.toFixed(1) * 4 
					}

					if (main.dataFilter.speed === "active" ) {  
						return Math.abs( d.tipVelocity[0].toFixed(1) )
					}

					if (main.dataFilter.origin === "active" ) {  
						return Math.abs( d.tipPosition[1].toFixed(1) )
					}
				})
				.attr('y', function(d) {
					if (main.dataFilter.length === "active" ) {  
						return 400 - d.length.toFixed(1) * 4 
					}

					if (main.dataFilter.speed === "active" ) {  
						return 400 - Math.abs( d.tipVelocity[0].toFixed(1) )
					}

					if (main.dataFilter.origin === "active" ) {  
						return 400 - Math.abs( d.tipPosition[1].toFixed(1) )
					}

				})
				.attr('fill', function(d) {
					return 'rgb( ' + (d.tipVelocity[0] * 10) + ', ' + (d.tipVelocity[1] * 10) + ', ' + (d.tipVelocity[2] * 10) + ' )';
				});
		
		}

		// here we just check that the other hand is visible
		if ( this.lastFrame.hands[1] ) {

			$secondHandBars.data( this.lastFrame.hands[1].fingers ).transition()

				// animate bar height
				.attr('height', function(d) {
					if (main.dataFilter.length === "active" ) {  
						return d.length.toFixed(1) * 4 
					}

					if (main.dataFilter.speed === "active" ) {  
						return Math.abs( d.tipVelocity[0].toFixed(1) )
					}

					if (main.dataFilter.origin === "active" ) {  
						return Math.abs( d.tipPosition[1].toFixed(1) )
					}

				})
				.attr('y', function(d) {
					if (main.dataFilter.length === "active" ) {  
						return 400 - d.length.toFixed(1) * 4 
					}

					if (main.dataFilter.speed === "active" ) {  
						return 400 - Math.abs( d.tipVelocity[0].toFixed(1) )
					}

					if (main.dataFilter.origin === "active" ) {  
						return 400 - Math.abs( d.tipPosition[1].toFixed(1) )
					}

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

	ToggleGroup: function( elems ) {
		this.groupElems = elems;
	},

	// set up the ui
	setup: function() {

		console.log("setting up the ui");

		this.$leftDrawer = $('#left');
		this.$leftDrawerToggle = $('button[data-ui="toggle"][href="#left"]');

		// click handler
		this.$leftDrawerToggle.bind( 'click', function() {

			ui.leftDrawerEvent();

		});

		// for each subheading, scan for btns
		$('#left').find('.btn').each( function() {
			
			var thisId = $( this ).attr( 'id' );				
			var thisState = $( this ).data( 'ui-state' );				
			
			// push the state value from the buttons, using their element's id as a key
			// these will be the values when we initialize
			main.dataFilter[ thisId ] = thisState;

		});

		// for each button group, make a new toggleGroup object
		$('div[class*=btn-group]').each( function() {

			var thisGroupElements = $(this).find('button[data-ui="toggle"]');

			// give it all the elements it needs to know about
			uiToggleGroup = new ui.ToggleGroup( thisGroupElements );

		});

		ui.ToggleGroup.prototype.clickToggle = function( event ) {
			// the toggle group knows its own elements
			// some toggles will be multi-select,
			// some will be exclusive.
			// let's do exclusives first

			// we're getting the event target. now,
			// when we get a click, toggle that data-ui-state
			// and if it's being toggled to on,
			// set all in its group to toggled off

			var $thisToggle = $( event.target );
			var $theseSiblings = $( event.target ).siblings('button');

			var thisId = $thisToggle.attr('id');
			var thisState = $thisToggle.attr('data-ui-state');

			console.log( 'this state was: ' + thisState );
			//console.log(this);

			// if this toggle was not active
			if ( !thisState ) {


				// set its state
				$thisToggle.attr('data-ui-state', 'active');

				console.log(thisId);
				// update the data filter
				main.dataFilter[thisId] = 'active';

				//console.log(main.dataFilter);

				// do the same for the siblings
				$theseSiblings.each( function(key, index) {

					// set their attributes
					$(this).attr('data-ui-state', '');

					// get the ids and states while we loop
					var thisId = $(this).attr('id');
					var thisState = $(this).data('ui-state');



					if ( main.dataFilter.hasOwnProperty( thisId ) ) {
						console.log('dataFilter has the property: ' + thisId);
						console.log(index);

						main.dataFilter[thisId] = '';

					 }

					// heres what we need to do.
					// in this loop, iterate thru
					// the object properties, matching the id
					// to the filter keys.
					// if they match, save the state
					// to the key's value.

					


				});

				console.log( main.dataFilter );

			}
		}

	},

	leftDrawerEvent: function() {

		if ( !this.$leftDrawer.hasClass('anim-toggled') ) {

			// the drawer isn't toggled. let's open it and bind its ui elements
			this.$leftDrawer.addClass('anim-toggled');
			this.$leftDrawerToggle.attr('data-ui-state', 'toggled');

			// find all our toggle groups
			this.$leftDrawer.find('div[data-ui="toggle-group"]').each( function() {

				// bind the click handler to each item
				$(this).bind( 'click', function(event) {

					// call click handler, and give it the clicked elem
					uiToggleGroup.clickToggle( event );
					//console.log( event );

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