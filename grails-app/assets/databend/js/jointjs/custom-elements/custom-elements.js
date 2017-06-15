// If the set of html elements has not been defined, define it
if(joint.shapes.html == undefined){
	joint.shapes.html = {};
}

/*
 * PortNode - A generic graph node with ports for edges. All nodes extend this node.
 */

	// Define the PortNode
	joint.shapes.html.PortNode = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {
	
	    markup: 
	    	'<g class="rotatable">' +
	    		'<g class="scalable">'+
	    			'<rect class="body"/>'+
	    		'</g>'+
	    		'<text class="label"/>'+
	    		'<g class="inPorts"/>'+
	    		'<g class="outPorts"/>' +
	    	'</g>',
	    portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
	
	    defaults: joint.util.deepSupplement({
	
	        type: 'html.PortNode',
	        size: { width: 64, height: 64 },
	        snapLinks: { radius: 64 },
	        inPorts: [],
	        outPorts: [],
	        attrs: {
	            '.': { magnet: false },
	            '.body': {
	                width: 64, 
	                height: 64,
	                fill: '#444444',
	                'rx': '8pt',
	                'ry': '8pt'
	                
	            },
	            '.port-body': {
	                r: '8pt',
	                magnet: true,
	                stroke: 'none'
	            },
	            text: {
	                'pointer-events': 'none'
	            },
	            //'.inPorts .port-body': { fill: '#ffccff' },
	            //'.outPorts .port-body': { fill: '#ccccff'},
	            '.inPorts circle': {type: 'input',  magnet: 'passive'},
	            '.outPorts circle': {type: 'output'},
	            // The "-71" below refers to the center of the port, kind of weird and don't care to think about it
	            '.inPorts .port-label': { 'ref-x': 0, 'ref-dy': -71, 'text-anchor': 'middle', fill: '#444444' },
	            '.outPorts .port-label': { 'ref-x': 0, 'ref-dy': -71, 'text-anchor': 'middle', fill: '#444444' }
	        }
	
	    }, joint.shapes.basic.Generic.prototype.defaults),
	
	    getPortAttrs: function(portName, index, total, selector, type) {
	
	        var attrs = {};
	
	        var portClass = 'port' + index;
	        var portSelector = selector + '>.' + portClass;
	        var portLabelSelector = portSelector + '>.port-label';
	        var portBodySelector = portSelector + '>.port-body';
	
	        // Setup port labels
	        if(selector === '.inPorts'){
	        	attrs[portLabelSelector] = { text: '-' };
	        }
	        else if(selector === '.outPorts'){
	        	
	        	if(portName == "errorPort"){
					attrs[portLabelSelector] = { text: '!'};
	        	}
	        	else if(portName == "ifPort"){
	        		attrs[portLabelSelector] = { text: '1'}; 
	        	}
	        	else if(portName == "elsePort"){
					attrs[portLabelSelector] = { text: '0'};
	        	}
	        	else{
	        		attrs[portLabelSelector] = { text: '+'};
	        	}
	        }
	        
	        // Setup port locations
	        if(selector === '.outPorts'){
	        	
	        	if(portName == "errorPort"){
	        		attrs[portBodySelector] = { port: { id: portName || _.uniqueId(type) , type: type } };
	        		attrs[portSelector] = { ref: '.body', 'ref-dy': 0, 'ref-x': 0.5 /*(index + 0.5) * (1 / total)*/ };
	        	}
	        	else{
	        		
			        attrs[portBodySelector] = { port: { id: portName || _.uniqueId(type) , type: type } };
	        		
	        		// If a single output, there must be no error port. 
	        		//	If there is ever a node with multiple outPorts and no errorPort this will need to be updated
	        		if(total == 1){
	        			attrs[portSelector] = { ref: '.body', 'ref-dx': 0, 'ref-y': 0.5 /*(index + 0.5) * (1 / total)*/ };
	        		}
	        		else{
	        			attrs[portSelector] = { ref: '.body', 'ref-dx': 0, 'ref-y': (index + 0.5) * (1 / (total - 1)) };
	        		}
	        	}
	        }
	        else if(selector === '.inPorts'){
		        attrs[portBodySelector] = { port: { id: portName || _.uniqueId(type) , type: type } };
		        attrs[portSelector] = { ref: '.body', 'ref-y': (index + 0.5) * (1 / total) };
		    }
	        
	        return attrs;
	    }
	}));
	
	joint.shapes.html.PortNodeView = joint.dia.ElementView.extend(joint.shapes.basic.PortsViewInterface);

/**
 * APITriggerNode - A trigger node with a single output edge port and name to reference via the API
 */
	
	// Define the Trigger Node
	joint.shapes.html.APITriggerNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.APITriggerNode',
	        inPorts: [],
	        outPorts: ['outPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	joint.shapes.html.APITriggerNodeView = joint.shapes.html.PortNodeView.extend(apiTriggerElement);

/**
 * IfNode - A condition graph node that triggers on one of three edge ports depending if the provided statement is true, false or an error occurred
 */
	
	// Define the If Node
	joint.shapes.html.IfNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.IfNode',
	        inPorts: ['inPort'],
	        outPorts: ['ifPort', 'elsePort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults),
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.IfNodeView = joint.shapes.html.PortNodeView.extend(ifElseElement);
	
/**
 * LogNode - A graph node that cuts a log on the server
 */
	
	// Define the Node
	joint.shapes.html.LogNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.LogNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.LogNodeView = joint.shapes.html.PortNodeView.extend(logElement);
	
/**
 * AndNode - A node that will not fire until all input edges have been triggered
 */
	
	// Define the Node
	joint.shapes.html.AndNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.AndNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.AndNodeView = joint.shapes.html.PortNodeView.extend(andElement);
	
/**
 * DelayNode - A node that will not fire until a delay completes
 */
	// Define the Node
	joint.shapes.html.DelayNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.DelayNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.DelayNodeView = joint.shapes.html.PortNodeView.extend(delayElement);
	
/**
 * EncryptionNode - A node that will encrypt/decrypt data
 */
	// Define the Node
	joint.shapes.html.EncryptionNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.EncryptionNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.EncryptionNodeView = joint.shapes.html.PortNodeView.extend(encryptionElement);
	
/**
 * CompressionNode - A node that will compress/decompress data
 */
	// Define the Node
	joint.shapes.html.CompressionNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.CompressionNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.CompressionNodeView = joint.shapes.html.PortNodeView.extend(compressionElement);
	
/**
 * ConversionNode - A node that will convert data
 */
	// Define the Node
	joint.shapes.html.ConversionNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.ConversionNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.ConversionNodeView = joint.shapes.html.PortNodeView.extend(conversionElement);			

/**
 * RunDataScriptNode - A node that will run a variable script against the data pool
 */
	// Define the Node
	joint.shapes.html.RunDataScriptNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.RunDataScriptNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.RunDataScriptNodeView = joint.shapes.html.PortNodeView.extend(runDataScriptElement);
	
/**
 * ActivateAnalyticsNode
 */
	// Define the Node
	joint.shapes.html.ActivateAnalyticsNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.ActivateAnalyticsNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.ActivateAnalyticsNodeView = joint.shapes.html.PortNodeView.extend(activateAnalyticsElement);	
	
/**
 * DeactivateAnalyticsNode
 */
	// Define the Node
	joint.shapes.html.DeactivateAnalyticsNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.DeactivateAnalyticsNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.DeactivateAnalyticsNodeView = joint.shapes.html.PortNodeView.extend(deactivateAnalyticsElement);	
	
/**
 * ReleaseAnalyticsNode
 */
	// Define the Node
	joint.shapes.html.ReleaseAnalyticsNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.ReleaseAnalyticsNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.ReleaseAnalyticsNodeView = joint.shapes.html.PortNodeView.extend(releaseAnalyticsElement);	
			
/**
 * ProtectAnalyticsNode
 */
	// Define the Node
	joint.shapes.html.ProtectAnalyticsNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.ProtectAnalyticsNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.ProtectAnalyticsNodeView = joint.shapes.html.PortNodeView.extend(protectAnalyticsElement);	

/**
 * ExportAnalyticsNode
 */
	// Define the Node
	joint.shapes.html.ExportAnalyticsNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.ExportAnalyticsNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.ExportAnalyticsNodeView = joint.shapes.html.PortNodeView.extend(exportAnalyticsElement);	
	
/**
 * ActivateAutomationGraphNode
 */
	// Define the Node
	joint.shapes.html.ActivateAutomationGraphNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.ActivateAutomationGraphNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.ActivateAutomationGraphNodeView = joint.shapes.html.PortNodeView.extend(activateAutomationGraphElement);		

/**
 * DeactivateAutomationGraphNode
 */
	// Define the Node
	joint.shapes.html.DeactivateAutomationGraphNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.DeactivateAutomationGraphNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.DeactivateAutomationGraphNodeView = joint.shapes.html.PortNodeView.extend(deactivateAutomationGraphElement);
	
/**
 * TriggerAutomationGraphNode
 */
	// Define the Node
	joint.shapes.html.TriggerAutomationGraphNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.TriggerAutomationGraphNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.TriggerAutomationGraphNodeView = joint.shapes.html.PortNodeView.extend(triggerAutomationGraphElement);
	
/**
 * TriggerEventNode
 */
	// Define the Node
	joint.shapes.html.TriggerEventNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.TriggerEventNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.TriggerEventNodeView = joint.shapes.html.PortNodeView.extend(triggerEventElement);	
	
	
/**
 * DereferenceDataPoolVariableNode
 */
	// Define the Node
	joint.shapes.html.DereferenceDataPoolVariableNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.DereferenceDataPoolVariableNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.DereferenceDataPoolVariableNodeView = joint.shapes.html.PortNodeView.extend(dereferenceDataElement);
	
	
/**
 * SendMessageNode
 */
	// Define the Node
	joint.shapes.html.SendMessageNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.SendMessageNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.SendMessageNodeView = joint.shapes.html.PortNodeView.extend(sendMessageElement);		
	
/**
 * RestNode  - A node that will issue a REST request and store the response in classified data
 */
	// Define the Node
	joint.shapes.html.RestNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.RestNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.RestNodeView = joint.shapes.html.PortNodeView.extend(restElement);
		
/**
 * RunRemoteScriptNode - A node that will run a script on the specified server
 */
	// Define the Node
	joint.shapes.html.RunRemoteScriptNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.RunRemoteScriptNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.RunRemoteScriptNodeView = joint.shapes.html.PortNodeView.extend(runRemoteScriptElement);	
	
/**
 * SoapNode  - A node that will issue Soap request and store the response in classified data
 */
	// Define the Node
	joint.shapes.html.SoapNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.SoapNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.SoapNodeView = joint.shapes.html.PortNodeView.extend(soapElement);
		
/**
 * TransferDataNode  - A node that will transfer data
 */
	// Define the Node
	joint.shapes.html.TransferDataNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.TransferDataNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.TransferDataNodeView = joint.shapes.html.PortNodeView.extend(transferDataElement);		
	
/**
 * PullFromTemplateConnectionNode  - A node that will push classified data from a connection via a template
 */
	// Define the Node
	joint.shapes.html.PullFromTemplateConnectionNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PullFromTemplateConnectionNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PullFromTemplateConnectionNodeView = joint.shapes.html.PortNodeView.extend(pullFromTemplateConnectionElement);
	
/**
 * PullFromTemplateVariableNode  - A node that will pull classified data from a data pool variable via a template
 */
	// Define the Node
	joint.shapes.html.PullFromTemplateVariableNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PullFromTemplateVariableNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PullFromTemplateVariableNodeView = joint.shapes.html.PortNodeView.extend(pullFromTemplateVariableElement);
		
/**
 * PullRawConnectionNode  - A node that will pull raw data from a connection
 */
	// Define the Node
	joint.shapes.html.PullRawConnectionNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PullRawConnectionNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PullRawConnectionNodeView = joint.shapes.html.PortNodeView.extend(pullRawConnectionElement);
	
/**
 * PullRawDataPoolNode  - A node that will pull raw data from a data pool
 */
	// Define the Node
	joint.shapes.html.PullRawDataPoolNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PullRawDataPoolNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PullRawDataPoolNodeView = joint.shapes.html.PortNodeView.extend(pullRawDataPoolElement);	
	
/**
 * PullJsonNode  - A node that will pull classified data from a connection via a JSON File
 */
	// Define the Node
	joint.shapes.html.PullJsonNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PullJsonNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PullJsonNodeView = joint.shapes.html.PortNodeView.extend(pullJsonElement);
	
/**
 * PullXmlNode  - A node that will pull classified data from a connection via a XML File
 */
	// Define the Node
	joint.shapes.html.PullXmlNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PullXmlNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PullXmlNodeView = joint.shapes.html.PortNodeView.extend(pullXmlElement);
	
/**
 * PullCsvNode  - A node that will pull classified data from a connection via a CSV File
 */
	// Define the Node
	joint.shapes.html.PullCsvNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PullCsvNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PullCsvNodeView = joint.shapes.html.PortNodeView.extend(pullCsvElement);	
	
/**
 * PullMetaDataNode  - A node that will pull meta data from a connection
 */
	// Define the Node
	joint.shapes.html.PullMetaDataNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PullMetaDataNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PullMetaDataNodeView = joint.shapes.html.PortNodeView.extend(pullMetaDataElement);	

/**
 * PullAutomationGraphNode  - A node that will pull classified data from a Data Bend Automation Graph
 */
	// Define the Node
	joint.shapes.html.PullAutomationGraphNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PullAutomationGraphNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PullAutomationGraphNodeView = joint.shapes.html.PortNodeView.extend(pullAutomationGraphElement);
	
/**
 * PullAnalyticsNode  - A node that will pull classified data from a Data Bend Analytics
 */
	// Define the Node
	joint.shapes.html.PullAnalyticsNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PullAnalyticsNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PullAnalyticsNodeView = joint.shapes.html.PortNodeView.extend(pullAnalyticsElement);
	
/**
 * PullMessageNode  - A node that will pull classified data from a Data Bend Message
 */
	// Define the Node
	joint.shapes.html.PullMessageNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PullMessageNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PullMessageNodeView = joint.shapes.html.PortNodeView.extend(pullMessageElement);	
	
/**
 * PullDataScriptNode  - A node that will pull classified data from a Data Bend data script
 */
	// Define the Node
	joint.shapes.html.PullDataScriptNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PullDataScriptNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PullDataScriptNodeView = joint.shapes.html.PortNodeView.extend(pullDataScriptElement);	
	
/**
 * PullDataTemplateNode  - A node that will pull classified data from a Data Bend Data Template
 */
	// Define the Node
	joint.shapes.html.PullDataTemplateNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PullDataTemplateNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PullDataTemplateNodeView = joint.shapes.html.PortNodeView.extend(pullDataTemplateElement);

/**
 * PushToTemplateConnectionNode  - A node that will push data to a connection via a template
 */
	// Define the Node
	joint.shapes.html.PushToTemplateConnectionNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PushToTemplateConnectionNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PushToTemplateConnectionNodeView = joint.shapes.html.PortNodeView.extend(pushToTemplateConnectionElement);
	
/**
 * PushToTemplateVariableNode  - A node that will push data to a data pool variable via a template
 */
	// Define the Node
	joint.shapes.html.PushToTemplateVariableNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PushToTemplateVariableNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PushToTemplateVariableNodeView = joint.shapes.html.PortNodeView.extend(pushToTemplateVariableElement);
	
/**
 * PushRawConnectionNode  - A node that will push raw data to a connection
 */
	// Define the Node
	joint.shapes.html.PushRawConnectionNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PushRawConnectionNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PushRawConnectionNodeView = joint.shapes.html.PortNodeView.extend(pushRawConnectionElement);
	
/**
 * PushRawDataPoolNode  - A node that will push raw data to a data pool
 */
	// Define the Node
	joint.shapes.html.PushRawDataPoolNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PushRawDataPoolNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PushRawDataPoolNodeView = joint.shapes.html.PortNodeView.extend(pushRawDataPoolElement);	
	
/**
 * PushJsonNode  - A node that will push data to connection via a JSON File
 */
	// Define the Node
	joint.shapes.html.PushJsonNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PushJsonNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PushJsonNodeView = joint.shapes.html.PortNodeView.extend(pushJsonElement);
	
/**
 * PushXmlNode  - A node that will push classified data to a connection via a XML File
 */
	// Define the Node
	joint.shapes.html.PushXmlNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PushXmlNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PushXmlNodeView = joint.shapes.html.PortNodeView.extend(pushXmlElement);
	
/**
 * PushCsvNode  - A node that will push data to a connection via a CSV file
 */
	// Define the Node
	joint.shapes.html.PushCsvNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PushCsvNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PushCsvNodeView = joint.shapes.html.PortNodeView.extend(pushCsvElement);	
	
/**
 * PushMetaDataNode  - A node that will push meta data to a connection
 */
	// Define the Node
	joint.shapes.html.PushMetaDataNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PushMetaDataNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PushMetaDataNodeView = joint.shapes.html.PortNodeView.extend(pushMetaDataElement);	

/**
 * PushAutomationGraphNode  - A node that will push classified data from a Data Bend Automation Graph
 */
	// Define the Node
	joint.shapes.html.PushAutomationGraphNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PushAutomationGraphNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PushAutomationGraphNodeView = joint.shapes.html.PortNodeView.extend(pushAutomationGraphElement);
	
/**
 * PushAnalyticsNode  - A node that will push classified data from a Data Bend Analytics
 */
	// Define the Node
	joint.shapes.html.PushAnalyticsNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PushAnalyticsNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PushAnalyticsNodeView = joint.shapes.html.PortNodeView.extend(pushAnalyticsElement);
	
/**
 * PushMessageNode  - A node that will push classified data from a Data Bend Message
 */
	// Define the Node
	joint.shapes.html.PushMessageNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PushMessageNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PushMessageNodeView = joint.shapes.html.PortNodeView.extend(pushMessageElement);
	
/**
 * PushDataScriptNode  - A node that will push classified data from a Data Bend DataScript
 */
	// Define the Node
	joint.shapes.html.PushDataScriptNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PushDataScriptNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PushDataScriptNodeView = joint.shapes.html.PortNodeView.extend(pushDataScriptElement);
	
/**
 * PushDataTemplateNode  - A node that will push classified data from a Data Bend Data Template
 */
	// Define the Node
	joint.shapes.html.PushDataTemplateNode = joint.shapes.html.PortNode.extend({
	
	   defaults: joint.util.deepSupplement({
	
	        type: 'html.PushDataTemplateNode',
	        inPorts: ['inPort'],
	        outPorts: ['outPort', 'errorPort'],
	        attrs: {
	        }
	
	    }, joint.shapes.html.PortNode.prototype.defaults)
	});
	
	// Create a custom view for that element that displays an HTML div above it.
	joint.shapes.html.PushDataTemplateNodeView = joint.shapes.html.PortNodeView.extend(pushDataTemplateElement);
		