({
	updateSectionHandlers : function(component, event, helper) {
        
        console.log('Next handler called');
        
        var sectionToRender = event.getParam("sectionName");
        var caseId = event.getParam("caseId");
        var entityType = event.getParam("entityType");
        
        console.log("Got Case Id in Next handler: "+caseId);
        console.log("Got Entity Type: "+entityType);
        
        component.set('v.caseId', caseId);
        component.set('v.sectionNameToRender', sectionToRender);
        component.set('v.entityType', entityType);
        
        document.querySelector("#taxiFormContainer").scrollIntoView();
    },
    
    doInit : function(component, event, helper) {   
      	component.find("transferDetails").fetchApplicationDetails();        
    },
    
    closeApplication : function(component, event, helper) {        
        console.log('Closed Called');
        $A.get("e.force:closeQuickAction").fire();
    }
})