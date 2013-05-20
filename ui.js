/*
	widgets -> api?
		- can:
			read write to an arbitrary data model
			write to the dom
*/

/* Multi toggle bug diagnosis:
you're not actually binding the click handler. nowhere is the click handler bound.
you just change the attributes based on what they were before. that's fine,
except when the button hits the outer div, it returns that as the event target
(which it is).
this might screw things up. we only want to change attrs on click events
on the buttons, not any ol event that comes around.
i don't know if this is the exact source of the problem, but perhaps the pattern
can be improved */

// ui object

var ui = {
	$leftDrawer: null,
	$leftDrawerTog: null,

	ToggleGroup: function( elems ) {
		this.groupElems = elems;
	},

	MultiToggle: function( elems ) {
		this.multiElems = elems;

		console.log('made a new multiToggle: ' + this );

		// this obj on construction has these elems
		// if we pass jq obj, we should get an array of dom objs,
		// which we can then call by index
	},

	// set up the ui
	setup: function() {
		// can we nest objects inside functions inside on object literal?

		// * setup widgets -> how?
		// *1 define objects
		// *2 define their methods ( inits, and )
		// 

		console.log("setting up the ui");

		this.$leftDrawer = $('#left');
		this.$leftDrawerToggle = $('button[data-ui="toggle"][href="#left"]');

		// click handler
		this.$leftDrawerToggle.bind( 'click', function() {
			console.log('left drawer event');

			ui.leftDrawerEvent();

		});

		// for each button group, make a new toggleGroup object
		$('div[data-ui="toggle-group"]').each( function() {

			var thisGroupElements = $(this).find('button[data-ui="toggle"]');

			// give it all the elements it needs to know about
			uiToggleGroup = new ui.ToggleGroup( thisGroupElements );

			//$(this).buttonset();

		});

		$('div[data-ui="multi-toggle"]').each( function() {
			var thisMultiElements = $(this).find('button[data-ui="toggle"]');

			multiToggle = new ui.MultiToggle( thisMultiElements );
		});

		// prototype methods
		ui.ToggleGroup.prototype.clickToggle = function( event ) {
			// the toggle group knows its own elements
			// some toggles will be multi-select,
			// some will be exclusive.
			// let's do exclusives first

			// we're getting the event target. now,
			// when we get a click, toggle that data-ui-state
			// and if it's being toggled to on,
			// set all in its group to toggled off
			console.log('toggle group event');

			var $thisToggle = $( event.target );
			var $theseSiblings = $( event.target ).siblings('button');

			var thisId = $thisToggle.attr('id');
			var thisState = $thisToggle.attr('data-ui-state');

			// if this toggle was not active
			if ( !thisState ) {

				// update our data filter
				main.updateDataFilter( thisId, 'active' );

				// set our state in the DOM
				$thisToggle.attr('data-ui-state', 'active');

				//console.log(main.dataFilter);

				// do the same for the siblings
				$theseSiblings.each( function(key, index) {

					// set their attributes
					$(this).attr('data-ui-state', '');

					// get the ids and states while we loop
					var thisId = $(this).attr('id');

					// update our data filter. 
					// we're turning the siblings associated filters off,
					// so we pass an empty string
					main.updateDataFilter( thisId, '' );

				});
			}
		}

		ui.MultiToggle.prototype.eventHandle = function( event ) {
			console.log('multi-toggle event');
			console.log(event);
			// do it the easy way first
			var $thisElem = $(event.target);
			var thisId = $thisElem.attr('id');

			if ( $thisElem.attr('data-ui-state') === '' ) {

				console.log(thisId + ' active');

				// it was inactive, let's turn it on
				$thisElem.attr('data-ui-state', 'active');

				// set the appropriate data filter item
				main.updateDataFilter( thisId, 'active' );

			} else {
				
				console.log(thisId + ' inactive');
				
				// make it inactive
				$thisElem.attr('data-ui-state', '');

				main.updateDataFilter( thisId, '' );
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

			this.$leftDrawer.find('div[data-ui="multi-toggle"]').each( function() {

				$(this).bind( 'click', function(event) {

					console.log('click on: ' + this);
					multiToggle.eventHandle( event );

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