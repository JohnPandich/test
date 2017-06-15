var triggerAutomationGraphElement = {
    template:
        "<div class='node'><div class='nodeEdge'>" +
        "   <span class='nodeDescription'>Trigger Automation Graph</span>" +
        "	<button class='nodeShowHide icon-minus'></button>" +
        "	<button class='nodeDelete icon-cross'></button>" +
	    "	<div class='nodeContent'>" +
	    "		<span class='nodeTitle' contenteditable='true'>Trigger Automation Graph</span>" + 
	    "		<br>" + 
	    "		<table>" +
		"			<tr><td><label>Automation Graph: </label></td> <td class='standardPadding'><span class='automationGraph standardBorder clickable standardPadding'>...</span></td></tr>" +
		"			<tr><td><label>Trigger: </label></td> <td class='standardPadding'><select class='trigger'></select></td></tr>" +
	    "		</table>" +
	    "	</div>" +
        "</div>",

    initialize: function() {
    	
    	var bbox = this.model.getBBox();
    	
    	//
        _.bindAll(this, 'updateBox');
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);
        this.$box = $(_.template(this.template)());

        // Prevent paper from handling pointer down.
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
        
        // Reacting on the trigger name change and store the trigger name data in the cell model.
        this.$box.find('.automationGraph').on('DOMSubtreeModified', _.bind(function(evt) {       	
            this.model.set('automationGraph', $(evt.target).html());
        }, this));
        // Load the trigger name with the value stored in the model
        this.$box.find('.automationGraph').html(this.model.get('automationGraph'));
        
        // Reacting on the trigger name change and store the trigger name data in the cell model.
        this.$box.find('.trigger').on('change', _.bind(function(evt) {       	
            this.model.set('trigger', $(evt.target).val());
        }, this));
        // Load the trigger name with the value stored in the model
        if(this.model.get('trigger') != null && this.model.get('trigger').length != 0){
        	this.$box.find('.trigger').val(this.model.get('trigger'));
        }
        else{
        	 this.$box.find('.trigger').closest("tr").hide();
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
        
        // Setup select
        var selectURL = this.model.prop("selectUrl");
        var triggerURL = this.model.prop("triggerUrl");
        object = this;
		var selectFunction = function (name, classification){		
			// Account for the root row
			var fullClass = name;
			if(classification != null && classification != ""){
				fullClass = classification + "." + name;
			}
			object.$box.find('.automationGraph').html(fullClass);
			
			// Setup the trigger select
			ProgressUtil.startInProgress();
			jQuery.ajax({
				url: triggerURL,
				data: {graphName: name, graphClassification: classification},
				method: 'GET',
				success: function(result){
			
					object.$box.find('.trigger').empty();
					
					var triggerMarkup = "";
					for(var trigger in result){
						triggerMarkup = triggerMarkup + "<option>" + trigger + "</option>";
					}
				
					object.$box.find('.trigger').append(triggerMarkup);
					object.$box.find('.trigger').closest("tr").show();
				},
				error: function(result){
					alert(result.responseText);
					console.log(result);
				},
				complete: function(){
					ProgressUtil.stopInProgress();
				}
			});
		}
		var select = function(){	
			ProgressUtil.startInProgress();
			jQuery.ajax({
				url: selectURL,
				method: 'GET',
				success: function(result){
					var selectPanel = new SelectPanel($("#diags"), "Select Automation Graph", ["Name", "Active"], result, selectFunction, "treeTableGraphRep");						
					selectPanel.open(); 					
				},
				error: function(result){
					alert(result.responseText);
					console.log(result);
				},
				complete: function(){
					ProgressUtil.stopInProgress();
				}
			});
		}
        this.$box.find('.automationGraph').click(function(event){  	
        	select();
        });
        
        
        
        // Update the box position whenever the underlying model changes.
        this.model.on('change', this.updateBox, this);
        paper.on('scale', this.updateBox, this);
        paper.on('translate', this.updateBox, this);
        //this.model.on('change', this.updateBox, this);
        
        //this.modle.on('outPortMouseOve', this.outPortMouseOver, this)
        
        // Remove the box when the model gets removed from the graph.
        this.model.on('remove', this.removeBox, this);
        //this.updateBox(); This is not needed
    },
    render: this.renderNode, // defined in shared-element-data
    updateBox: this.updateNode, // defined in shared-element-data
    removeBox: this.removeNode // defined in shared-element-dataata
};