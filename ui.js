/*
	widgets -> api?
		- can:
			read write to an arbitrary data model
			write to the dom
*/

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

			ui.leftDrawerEvent();

		});

		// for each button group, make a new toggleGroup object
		$('div[class*=btn-group]').each( function() {

			var thisGroupElements = $(this).find('button[data-ui="toggle"]');

			// give it all the elements it needs to know about
			uiToggleGroup = new ui.ToggleGroup( thisGroupElements );

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

			var $thisToggle = $( event.target );
			var $theseSiblings = $( event.target ).siblings('button');

			var thisId = $thisToggle.attr('id');
			var thisState = $thisToggle.attr('data-ui-state');

			console.log( 'this state was: ' + thisState );
			//console.log(this);

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

				console.log( main.dataFilter );

			}
		}

		ui.MultiToggle.prototype.eventHandle = function( event ) {
			// console.log('logging "this" from the prototype: ' + this );
			// console.log(this.multiElems);
			// console.log(this.multiElems[1]);
			// console.log(this.multiElems[1].getAttribute('id'));

			// do it the easy way first
			var $thisElem = $(event.target);
			var thisId = $thisElem.attr('id');

			if ( $thisElem.attr('data-ui-state') === '' ) {

				// it was inactive, let's turn it on
				$thisElem.attr('data-ui-state', 'active');

				// set the appropriate data filter item
				main.updateDataFilter( thisId, 'active' );

			} else {

				// it had a state, which means it was active
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