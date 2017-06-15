var runDataScriptElement = {
    template:
        "<div class='node'><div class='nodeEdge'>" +
        "   <span class='nodeDescription'>Run Data Script</span>" +
        "	<button class='nodeShowHide icon-minus'></button>" +
        "	<button class='nodeDelete icon-cross'></button>" +
	    "	<div class='nodeContent'>" +
	    "		<span class='nodeTitle' contenteditable='true'>Run Data Script</span>" + 
	    "		<br>" + 
	    "		<table><tr>" +
		"			<td><label>Data Script: </label></td> <td class='standardPadding'><span class='dataScript standardBorder clickable standardPadding'>...</span></td>" +
	    "		</tr></table>" +
	    "	</div>" +
        "</div>",

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
        
        // Reacting on the trigger name change and store the trigger name data in the cell model.
        this.$box.find('.dataScript').on('DOMSubtreeModified', _.bind(function(evt) {     	
            this.model.set('dataScript', $(evt.target).html());            
        }, this));
        // Load the trigger name with the value stored in the model
        this.$box.find('.dataScript').html(this.model.get('dataScript'));
        
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
        
        // Setup select script
        var selectScriptURL = this.model.prop("selectUrl");
        
    	var $boxRef = this.$box;
		var selectFunction = function (scriptName, scriptClass){				
			// Account for the root row
			var scriptFullClass = scriptName;
			if(scriptClass != null && scriptClass != ""){
				scriptFullClass = scriptClass + "." + scriptName;
			}
		
			// $boxRef = this.$box above
			$boxRef.find('.dataScript').html(scriptFullClass);
		}
		var select = function(){		
			ProgressUtil.startInProgress();
			jQuery.ajax({
				url: selectScriptURL,
				method: 'GET',
				success: function(result){					
					var selectPanel = new SelectPanel($("#diags"), "Select Data Script", ["Name"], result, selectFunction, "treeTableScriptRep");	
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
        this.$box.find('.dataScript').click(function(event){  	
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