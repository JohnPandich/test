var runRemoteScriptElement = {
    template:
        "<div class='node'><div class='nodeEdge'>" +
        "   <span class='nodeDescription'>Run Remote Script</span>" +
        "	<button class='nodeShowHide icon-minus'></button>" +
        "	<button class='nodeDelete icon-cross'></button>" +
	    "	<div class='nodeContent'>" +
	    "		<span class='nodeTitle' contenteditable='true'>Run Remote Script</span>" + 
	    "		<br>" + 
	    "		<div class='panelContainer'>" +
	    "		</div>" +	    
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
        
        // Load the panel
        // 	The following logic is defined in web-app/js/databend-panels/
        var panelContainer = this.$box.find('.panelContainer');
        var nodePanel = new RunRemoteScriptPanel($(panelContainer));
        nodePanel.setupRunRemoteScriptPanel();
        
        // Setup model update on change
        var runRemoteScriptDiv = $(panelContainer).find("[name='runRemoteScriptDiv']");
        $(runRemoteScriptDiv).data("model", this.model);
        $(runRemoteScriptDiv).find("[name]").on('DOMSubtreeModified', function(event){
        	var runRemoteScriptDiv = $(event.target).closest("[name='runRemoteScriptDiv']");
        	var getDataFunction  = $(runRemoteScriptDiv).data("getDataFunction");
        	$(runRemoteScriptDiv).data("model").set('nodeData', nodePanel.getDataFunction());
        });
        
        // Initialize panel data  
        if(this.model.get('nodeData') != null){     
        	nodePanel.setDataFunction(this.model.get('nodeData'));
        }
        
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