({
    editContact : function(component, event) {
        
        console.log("In edit");
        var recId = event.currentTarget.getAttribute("data-recordId");    
        
        $A.createComponent(
            "c:EditExistingContact",
            {
                "recordId": recId, "IsTaxiContact": "true", "hideAccessLevels": component.get("v.hideAccessLevels")
            },
            function(newComponent, status, errorMessage) {
                
                console.log(status);
                if (status === "SUCCESS") {
                    component.set("v.body", newComponent);
                } else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.");
                } else if (status === "ERROR") {
                    console.log("Error: " + errorMessage);
                }
            });
    },
    deactivateFunctionality : function(component, event, selectedRecords){
        
        var action = component.get("c.deactivateContact");
        action.setParams({
            "idsToDeactivate" : selectedRecords
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log(state);
            if(state == 'SUCCESS'){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Success",
                    "message": "Contact deactivated successfully.",
                    "duration":10000,
                    "type":"success"
                });
                toastEvent.fire();
                $A.get('e.force:refreshView').fire();
                var refreshContactsEvent = component.getEvent('refreshContactEvent');  
                refreshContactsEvent.fire();
            }
            else if (state === "ERROR"){
                var errors = response.getError();
                console.log(errors);    
            }  
        });
        $A.enqueueAction(action);
    },
    showSpinner : function(component, event){
        
        var spinner = component.find("spinner");
        $A.util.addClass(spinner, "slds-show");
        $A.util.removeClass(spinner, "slds-hide");
    },
    hideSpinner : function(component, event){
        
        var spinner = component.find("spinner");
        $A.util.addClass(spinner, "slds-hide");
        $A.util.removeClass(spinner, "slds-show");
    },
})