/*
 * Main application singleton for running the app loop
 * 
 * Using this template to run the simple script for the UI task
 *
 * Copyright 2017 Travis Nicholson
 *
 */
 
var app = (function() {

	function AppClass() {

	    var __private__ = {
			// private variables container
            privateboolean: false
	    };
		
		// Using "my" as an alias for private properties and functions
	    var my = __private__;
		
		// Using "self" as an alias for "public" properties and functions
	    var self = this;

	    // public globals etc should be created in this space
		self.imageMap = {};

		// initialization placeholder
        self.init = function() {
        	self.imageMap = new ImageCanvas();
    	}
		
		// main loop placeholder
    	self.run = function() {

    	};

    }

	return new AppClass;
})();  // Run the unnamed function and assign the results to app for use.


// With all that done, time to initiate and run the app!
$(document).ready( function() {
	
    app.init();
    app.run();
    
});
