/**
 *  All script related to the image canvas object
 *  
 *  Although the templating is for a proper class, for time saving,
 *  this will run like a simple script, rather than using proper
 *  class structure. Just for this task!
 *  
 *  Copyright Travis Nicholson 2017
 */

function ImageCanvas(){
	
	// simple private members
	var local = {
			
	}
	
	// setup function
	local.init = function(){
		
	}
	
	// public alias
	var self = this;
	
	// public members
	self.canvasWrapper = {};
	self.canvas = {};
	
	self.textBoxConfig = {
		selectable : false,
		editable: false,
		visible: false,
	    fontSize: 24,
	    fontFamily: 'Arial',
	    textAlign: 'center',
	    color: '#FFFFFF',
	    width: 600,
	    height: 60,  
	    backgroundColor: '#003c79',
	    fill: 'white'
	};
	
	self.loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce gravida orci eros, sodales imperdiet augue aliquet sed. Aenean finibus ' +
    'commodo mi a egestas. Sed quis lacinia nisl, sit amet maximus metus. Aenean nec vestibulum dolor. Aliquam vitae lectus pretium, tincidunt ' +
    'quam quis, venenatis diam. Aenean porta ipsum nisi, in bibendum lorem pretium non. Vestibulum id rhoncus velit. Morbi sit amet erat eu ' +
    'odio euismod accumsan. Aenean posuere, magna eget pellentesque mattis, velit elit vulputate mi, id egestas purus tellus quis urna. ' +
    'Duis venenatis cursus sem ornare tincidunt. Vivamus rhoncus sem sed viverra consequat.';
	
	self.infoBox = new fabric.Textbox(self.loremIpsum, self.textBoxConfig);
	
	self.infoBoxStroke = 8;
	self.infoBoxOffset = (self.infoBoxStroke * 0.5) + 0.5;
	self.infoBoxBackground = new fabric.Rect({
		visible : false,
		selectable : false,
        top : self.infoBox.top - self.infoBoxOffset,
        left : self.infoBox.left - self.infoBoxOffset,
        width : self.infoBox.width,
        height : self.infoBox.height,
        fill : '#FFFFFF',
        stroke : 'black',
        strokeWidth : self.infoBoxStroke
    });
	
	// Collection of hover boxes (for highlight events) to place on the image
	self.hoverBoxes = new Map();
	
	// Create our hover boxes for the image
	self.baseHoverBox = new fabric.Rect({
		height: 400,
		top: 200,
		fill: 'rgba(0,0,0,0)'
	});
	
	// Method to move the infobox & co to a new spot and reveal it
	self.moveInfoBox = function(xCoord){
		self.infoBox.setLeft(xCoord - (self.infoBox.width * 0.5));
		self.infoBox.setTop(650);
		self.infoBox.visible = true; //ensure visibility of each object
		
		self.infoBoxBackground.setLeft(self.infoBox.left - self.infoBoxOffset);
		self.infoBoxBackground.setTop(self.infoBox.top - self.infoBoxOffset);
		self.infoBoxBackground.visible = true;
	};
	
	// Convienience method to pump out custom hover boxes
	self.makeHoverBox = function(setWidth, setLeft){
		var newBox = self.baseHoverBox.clone();
		newBox.setWidth(setWidth);
		// all boxes are the same height for this task
		newBox.setLeft(setLeft);
		newBox.selectable = false;
		newBox.on('mouseover', function() {
		    self.moveInfoBox(this.left + (this.width * 0.5));
		    // here we could have a method to set the appropriate text, instead of lorem ipsum
		    self.canvas.renderAll();
		});
		newBox.on('mouseout', function() {
			// placeholder in case we want the infobox to, say, hide itself while no boxes
			// are being hovered over
		});
		
		return newBox;
	}
	
	self.hoverBoxes.set("hoverBox1", self.makeHoverBox(1160, 50));
	self.hoverBoxes.set("hoverBox2", self.makeHoverBox(600, 1210));
	self.hoverBoxes.set("hoverBox3", self.makeHoverBox(220, 1810));
	self.hoverBoxes.set("hoverBox4", self.makeHoverBox(310, 2030));
	self.hoverBoxes.set("hoverBox5", self.makeHoverBox(575, 2340));
	self.hoverBoxes.set("hoverBox6", self.makeHoverBox(200, 3915));
	
	
	
	// Set up the canvas container and make the canvas
	self.canvasWrapper = $("#app-area");
	self.canvas = new fabric.Canvas("image-canvas");
	
	self.canvas.setBackgroundColor('rgb(255, 255, 255)', self.canvas.renderAll.bind(self.canvas));
	self.canvas.setBackgroundImage('../img/image.png', self.canvas.renderAll.bind(self.canvas), {
	    backgroundImageStretch: false
	});
	
	// Add our objects to the canvas
	self.canvas.add(self.infoBoxBackground);
	self.canvas.add(self.infoBox);

	self.hoverBoxes.forEach(function(value, key, map){
		self.canvas.add(value);
	});

	// Simply set the canvas size to the size of the wrapper
	self.resizeCanvas = function() {
		self.canvas.setWidth(self.canvasWrapper.width());
		self.canvas.setHeight(self.canvasWrapper.height());
		self.canvas.renderAll();
	}
	
	self.resizeCanvas();
	
	// Panning logic for our image
	self.startPan = function(event) {
		if (event.button != 2) {
			return;
		}
		var x0 = event.screenX,
		y0 = event.screenY;
		function continuePan(event) {
			var x = event.screenX,
			y = event.screenY;
			self.canvas.relativePan({ x: x - x0, y: y - y0 });
			x0 = x;
			y0 = y;
		}
		function stopPan(event) {
			$(window).off('mousemove', continuePan);
			$(window).off('mouseup', stopPan);
		};
		$(window).mousemove(continuePan);
		$(window).mouseup(stopPan);
		$(window).contextmenu(self.cancelMenu);
	};
	self.cancelMenu = function() {
		$(window).off('contextmenu', self.cancelMenu);
		return false;
	}
	$(self.canvasWrapper).mousedown(self.startPan);
	
	// Zoom logic
    self.canvasWrapper.on('wheel', function(e){
        if(e.originalEvent.deltaY < 0) {
        	self.canvas.setZoom(self.canvas.getZoom() * 1.1);
        }
        else{
        	self.canvas.setZoom(self.canvas.getZoom() * 0.9);
        }
    });
    
    // init textbox, with a background rectangle for stroke
    

    $( window ).resize(function() {
    	self.resizeCanvas();
    });

}

