var logElement = {
    template:
        "<div class='node'><div class='nodeEdge'>" +
        "   <span class='nodeDescription'>Log</span>" +
        "	<button class='nodeShowHide icon-minus'></button>" +
        "	<button class='nodeDelete icon-cross'></button>" +
	    "	<div class='nodeContent'>" +
	    "		<span class='nodeTitle' contenteditable='true'>Log</span>" + 
	    "		<br>" + 
	    "		<table><tr>" +
		"			<td><label>Log Statement: </label></td> <td><div class='logStatement aceField'></div></td>" +
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
        
		// Appemd a panel id so this panel can be uniquely identified
        if(this.model.get('panelId') == null && this.model.get('nodeId') == ""){
			this.panelId = 0;
			while( $("[panel-id='" + this.panelId.toString() + "']").size() > 0){
				this.panelId = Math.random();
			}
			this.$box.attr("panel-id", this.panelId.toString());
        
			this.model.set('panelId', this.panelId.toString());
        }
        else{
        	this.$box.attr("panel-id", this.model.get('panelId'));
        }
        
        // Reacting on the trigger name change and store the trigger name data in the cell model.
        this.$box.find('.nodeTitle').on('focusout', _.bind(function(evt) {
            this.model.set('nodeTitle', $(evt.target).html());
            this.$box.find('.nodeDescription').html($(evt.target).html());
        }, this));
        // Load the trigger name with the value stored in the model
        this.$box.find('.nodeTitle').html(this.model.get('nodeTitle'));
        this.$box.find('.nodeDescription').html(this.model.get('nodeTitle'));
        
        // Setup the logStatement
		aceEdit = ace.edit( this.$box.find(".logStatement").get(0) );
		aceEdit.setTheme("ace/theme/chrome");
		aceEdit.getSession().setMode("ace/mode/runtimestring");
		aceEdit.setOptions({
			fontSize: "1em",
			showPrintMargin: false
		});
		this.$box.find(".logStatement").data("ace", aceEdit);
        
        // Reacting on the identifiers & comparator change and store the identifier data in the cell model.
		var object = this;
        this.$box.find('.logStatement').data("ace").getSession().on('change', _.bind(function(evt) {       	       	
            object.model.set('logStatement', object.$box.find('.logStatement').data("ace").getValue());
        }, this));
        // Load the trigger identifier & comparator with the value stored in the model
       if(this.model.get('logStatement') != null){ 
    	   this.$box.find('.logStatement').data("ace").setValue(this.model.get('logStatement'));
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