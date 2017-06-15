// Shared functions 
this.renderNode = function() {
    joint.dia.ElementView.prototype.render.apply(this, arguments);
    this.paper.$el.prepend(this.$box);
    this.updateBox();
    
    //this.$box.css({"-webkit-animation": "changeSize 0.1s ease-out 0 1 forwards"}); Shoudl we try to smooth the change size? something LIKE this will work
    
    return this;
};

this.updateNode = function(event) {

    // Set the position and dimension of the box so that it covers the JointJS element.
	var bbox = this.model.getBBox();
	
    // Use the x and y location of the box, accounting for any origin offsets (pan) and zooms, including a center pan while zooming (originX and originY are defined in the automation view) 
 	var container = $(this.model.prop("containerSelector"));
 	
 	// Handle broken zoom in Firefox
 	if( navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ){
 		
 	    var xLoc = (bbox.x - (paper.options.width / 2)) * scaleFactor + (paper.options.width / 2) + (originX * scaleFactor);
 	    var yLoc = (bbox.y - (paper.options.height / 2)) * scaleFactor + (paper.options.height / 2) + (originY * scaleFactor);
 	    
 	    deltaWidth = bbox.width - (bbox.width * scaleFactor);
 	    xLoc = xLoc - deltaWidth / 2;

 	    deltaHeight = bbox.height - (bbox.height * scaleFactor);
 	    yLoc = yLoc + deltaHeight / 6;
 	    
 	    // Example of updating the HTML with a data stored in the cell model.
 	    if(bbox.width != 0 && bbox.height != 0){
 	    	this.$box.css({width: bbox.width, height: bbox.height, left:xLoc, top: yLoc, transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)' });
 	    }
 	    else{
 	    	this.$box.css({left: xLoc, top: yLoc, transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)' });
 	    }
 	   
 	    // Zoom to match paper (scaleFactor is defined in the automation view)
 	   // this.$box.css({"scale": scaleFactor});
 		this.$box.css({"-webkit-transform": "scale("+scaleFactor+")"});
 	    this.$box.css({"-moz-transform": "scale("+scaleFactor+")"});
 	    this.$box.css({"-ms-transform": "scale("+scaleFactor+")"});
 	    this.$box.css({"-o-transform": "scale("+scaleFactor+")"});
 	    this.$box.css({"transform": "scale("+scaleFactor+")"});
 	}
 	else{
 	    // Zoom to match paper (scaleFactor is defined in the automation view)
 	    this.$box.css({zoom: scaleFactor});
 	    
 	    // Use the x and y location of the box, accounting for any origin offsets (pan) and zooms, including a center pan while zooming (originX and originY are defined in the automation view)
 	    var xLoc = (bbox.x - ((paper.options.width / 2)) - $(container).offset().left) + (((paper.options.width / 2) + $(container).offset().left) / scaleFactor) +  originX;
 	    var yLoc = (bbox.y - ((paper.options.height / 2)) - $(container).offset().top) + (((paper.options.height / 2) + $(container).offset().top) / scaleFactor) +  originY;
 	    
 	    // Example of updating the HTML with a data stored in the cell model.
 	    if(bbox.width != 0 && bbox.height != 0){
 	    	this.$box.css({width: bbox.width, height: bbox.height, left:xLoc, top: yLoc, transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)' });
 	    }
 	    else{
 	    	this.$box.css({left: xLoc, top: yLoc, transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)' });
 	    }
 	}
};

this.removeNode = function(evt) {
    this.$box.remove();
}