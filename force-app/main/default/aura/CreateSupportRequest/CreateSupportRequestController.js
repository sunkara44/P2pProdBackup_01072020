({
    createNewSupportRequest : function(component, event, helper) {
        helper.createNewSupportRequest(component,event);		
    },
    
    onKeyUp : function(component, event, helper){
        if (event.getParam('keyCode')===13) {
            helper.createNewSupportRequest(component,event);
        }
    },
    
    closemodal : function(component, event, helper) {
        helper.closemodal(component,event);
    },
    
    contactTypeChange : function(component,event,helper){
        component.find('contactTypeInput').set("v.errors", null);
        
        if(component.get("v.contactType") == "Nominated Director/Manager") {
            component.set("v.isContactTypeNominatedDirector", true);
        } 
        else {
            component.set("v.isContactTypeNominatedDirector", false);
        }
    },
    
    contactRoleChange : function(component,event,helper){
        component.find('contactRoleInput').set("v.errors", null);
    },
    
    familyNameChange : function(component,event,helper){
        component.find('familyNameInput').set("v.errors", null);
    },
    
    firstGivenNameChange : function(component,event,helper){
        component.find('firstGivenNameInput').set("v.errors", null);
    },
    
})