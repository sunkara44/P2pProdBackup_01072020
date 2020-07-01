({
    doInit : function(component, event, helper) {
        
        helper.showSpinner(component, event);
        
        console.log("In doInit");
        
        var accountId = component.get("v.accountId");
        console.log('Got Account Id: '+accountId);
        
        var BaseURL = $A.get('$Label.c.Community_Base_Url');
        
        component.set('v.baseUrl',BaseURL);
        
        if(accountId == '') {
            
            var accountAction = component.get('c.getLoggedInUserAccount');        
            accountAction.setCallback(this, function(result) {
                
                component.set('v.customerNumber', result.getReturnValue().Account.Customer_Number__c);
                component.set('v.accountName', result.getReturnValue().Account.Name);
                component.set('v.loggedInUserContactId', result.getReturnValue().ContactId);
                helper.hideSpinner(component, event);
            });
            
            $A.enqueueAction(accountAction);
            
            var action = component.get("c.getContacts");
            var contacts = [];
            action.setCallback(this, function(response) {
                console.log(response.getState());
                var state = response.getState();
                console.log(state);
                console.log(response);
                if (state === "SUCCESS") {
                    component.set('v.contactList',response.getReturnValue());
                    helper.hideSpinner(component, event);
                }
            });
            
            $A.enqueueAction(action);
        }
        else {
            
            var accountAction = component.get('c.getAccountDataForAgents');  
            accountAction.setParams({
                "accId": accountId
            });
            accountAction.setCallback(this, function(result) {
                
                var response = result.getReturnValue();
                
                if(response == $A.get("$Label.c.UNAUTHORISED_ACCESS")) {
                    
                    var toastEvent = $A.get("e.force:showToast");           	
                    toastEvent.setParams({
                        "title": "Error",
                        "message": $A.get("$Label.c.UNAUTHORISED_ACCESS"),
                        "type": "error",
                        "duration":10000
                    });
                    toastEvent.fire();
                }
                else {
                    var act = JSON.parse(response);
                    component.set('v.accountName', act.Name);
                    component.set('v.customerNumber', act.Customer_Number__c);
                }
            });
            $A.enqueueAction(accountAction); 
            
            var action = component.get("c.getContactsForAgents");
            action.setParams({
                "requiredAccId": accountId
            });
            var contacts = [];
            action.setCallback(this, function(response) {
                console.log(response.getState());
                var state = response.getState();
                console.log(state);
                console.log(response);
                if (state === "SUCCESS") {
                    
                    var result = response.getReturnValue();
                    
                    if(result == null) {
                        
                        var toastEvent = $A.get("e.force:showToast");           	
                        toastEvent.setParams({
                            "title": "Error",
                            "message": $A.get("$Label.c.UNAUTHORISED_ACCESS"),
                            "type": "error",
                            "duration":10000
                        });
                        toastEvent.fire();
                    }
                    else {
                        
                        component.set('v.contactList', result);
                    }
                    helper.hideSpinner(component, event);
                }
            });
            
            $A.enqueueAction(action);
        }
    },
    addContact : function(component, event, helper) {
        console.log("In AddContact");
        $A.createComponent(
            "c:CreateSupportRequest",
            {
                
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
    deleteContact : function(component, event, helper) {
        console.log("In deleteContact");
    },
    navigateToContact: function(component,event,helper){
        var recId = event.currentTarget.getAttribute("data-RecId");
        var urlEvent = $A.get("e.force:navigateToURL");
        var contactLink = 'contact/' + recId;
        urlEvent.setParams({
            "url": contactLink
        });
        urlEvent.fire();
    },
    confirmContactDeactivate: function(component, event, helper) {
        
        var selectedRecords = [];
        var uncheckboxesChecked = [];
        console.log("In Deactivate");
        
        var checkboxes = document.getElementsByClassName('checkbox');        
        
        for (var i=0; i<checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                selectedRecords.push(checkboxes[i].getAttribute("data-RecId"));
            }
        }
        component.set("v.selectedContactRecords", selectedRecords);
        console.log(selectedRecords);
        
        if(selectedRecords.length === 0) {
            
            var toastEvent = $A.get("e.force:showToast");           	
            toastEvent.setParams({
                "title": "Error",
                "message": "No records selected.",
                "duration":10000,
                "type": "error"
            });
            toastEvent.fire();
        }
        else {
            
            $A.createComponent(
                "c:ModalMessageConfirmBox",
                {
                    "message": "You are about to deactivate "+selectedRecords.length+" user(s). <br/>Please note this contact will no longer have access to the Point to Point Industry Portal.",
                    "confirmType": "Deactivate"
                    
                },
                function(newComponent, status, errorMessage){
                    console.log(status);
                    if (status === "SUCCESS") {                    
                        component.set("v.body", newComponent);                    
                    }
                    else if (status === "INCOMPLETE") {
                        console.log("No response from server or client is offline.");
                        // Show offline error
                    } else if (status === "ERROR") {
                        console.log("Error: " + errorMessage);
                        // Show error message
                    }                
                }
            );
        }
    },
    contactDeactivate: function(component, event, helper) {
        var selectedRecords = component.get("v.selectedContactRecords");
        console.log(selectedRecords);
        
        helper.deactivateFunctionality(component,event,selectedRecords);
    },
    editContact : function(component, event, helper) {
        console.log("Controller");
        helper.editContact(component, event);
    }    
})