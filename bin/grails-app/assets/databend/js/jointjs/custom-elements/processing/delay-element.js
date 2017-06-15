var delayElement = {
    template:
        "<div class='node'><div class='nodeEdge'>" +
        "   <span class='nodeDescription'>Delay</span>" +
        "	<button class='nodeShowHide icon-minus'></button>" +
        "	<button class='nodeDelete icon-cross'></button>" +
	    "	<div class='nodeContent'>" +
	    "		<span class='nodeTitle' contenteditable='true'>Delay</span>" + 
	    "		<br>" + 
	    "		<table><tr>" +
		"			<td><label>Delay (ms): </label></td> <td><div class='delay aceField' name='delay'></div></td>" +
	    "		</tr></table>" +
	    "	</div>" +
        "</div></div>",

    initialize: function() {
    	
    	var bbox = this.model.getBBox();
    	
    	//
        _.bindAll(this, 'updateBox');
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);
        this.$box = $(_.template(this.template)());

        // Prevent paper from handling pointerdown.
        this.$box.find('button, input, .nodeTitle').on('mousedown click', function(evt) { evt.stopPropagation(); });
        
        // Append the node-id to the html
        this.$box.closest(".node").attr( "node-id", this.model.get("id"));
        
        // Reacting on the trigger name change and store the trigger name data in the cell model.
        this.$box.find('.nodeTitle').on('focusout', _.bind(function(evt) {
            this.model.set('nodeTitle', $(evt.target).html());
            this.$box.find('.nodeDescription').html($(evt.target).html());
        }, this));
        // Load the trigger name with the value stored in the model
        this.$box.find('.nodeTitle').html(this.model.get('nodeTitle'));
        this.$box.find('.nodeDescription').html(this.model.get('nodeTitle'));
        
     // Setup the delay
		aceEdit = ace.edit( this.$box.find(".delay").get(0) );
		aceEdit.setTheme("ace/theme/chrome");
		aceEdit.getSession().setMode("ace/mode/runtimeint");
		aceEdit.setOptions({
			fontSize: "1em",
			showPrintMargin: false
		});
		this.$box.find(".delay").data("ace", aceEdit);
        
        // Reacting on the identifiers & comparator change and store the identifier data in the cell model.
        this.$box.find('.delay').data("ace").getSession().on('change', _.bind(function(evt) {
            this.model.set('delay', $(evt.target).data("ace").getValue());
        }, this));
        // Load the trigger identifier & comparator with the value stored in the model
       if(this.model.get('delay') != null){ 
    	   this.$box.find('.delay').data("ace").setValue(this.model.get('delay'));
       }
        
		// Setup Events
        this.$box.find(".aceField").mousedown(function(event){
			$(this).height("2em");
			$(this).data("ace").resize();
		});
        this.$box.find(".aceField").focusout(function(event){
			$(this).height("1em");
			$(this).data("ace").resize();
		});
        
        this.$box.find('.nodeDelete').on('click', _.bind(this.model.remove, this.model));
        
        this.$box.find('.nodeShowHide').on('click', _.bind(function(evt){

    		if(this.$box.find(".nodeContent").is(":visible")){
    			
    			this.$box.find(".nodeContent").hide();

	    		this.$box.find(".nodeShowHide").removeClass("icon-minus");
	    		this.$box.find(".nodeShowHide").addClass("icon-plus");   
        	}
    		else{
    			
    			this.$box.find(".nodeContent").show();
    			
	    		this.$box.find(".nodeShowHide").removeClass("icon-plus");
	    		this.$box.find(".nodeShowHide").addClass("icon-minus");   
        	}
        },this));
        
        // Update the box position whenever the underlying model changes.
        this.model.on('change', this.updateBox, this);
        paper.on('scale', this.updateBox, this);
        paper.on('translate', this.updateBox, this);
        //this.model.on('change', this.updateBox, this);
        
        //this.modle.on('outPortMouseOve', this.outPortMouseOver, this)
        
        // Remove the box when the model gets removed from the graph.
        this.model.on('remove', this.removeBox, this);

        this.updateBox();
    },
    render: this.renderNode, // defined in shared-element-data
    updateBox: this.updateNode, // defined in shared-element-data
    removeBox: this.removeNode // defined in shared-element-data
};