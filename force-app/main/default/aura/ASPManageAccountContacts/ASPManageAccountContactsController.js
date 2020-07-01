({
    doInit : function(component, event, helper) {
        
        console.log("In doInit");
        helper.showSpinner(component, event);
        
        var BaseURL = $A.get('$Label.c.Community_Base_Url');
        component.set('v.baseUrl',BaseURL);
        
        var accountAction = component.get('c.getLoggedInUserAccount');
		       
        accountAction.setCallback(this, function(result) {
            helper.hideSpinner(component, event);
            
            console.log("getLoggedInUserAccount");
            console.log(result.getReturnValue().Account.Record_Type_Dev_Name__c);
            
            component.set('v.customerNumber', result.getReturnValue().Account.Customer_Number__c);
            component.set('v.accountName', result.getReturnValue().Account.Name);
            component.set('v.loggedInUserContactId', result.getReturnValue().ContactId);
            component.set('v.loggedInUserAccountType', result.getReturnValue().Account.Record_Type_Dev_Name__c);            
        });
        $A.enqueueAction(accountAction);
        helper.showSpinner(component, event);
        
        var action = component.get("c.getContacts");
        var contacts = [];
        action.setCallback(this, function(response) {
            
            helper.hideSpinner(component, event);
            
            console.log('Contacts Fetched:');
            console.log(response.getReturnValue());
            
            var state = response.getState();
            console.log(state);
            if (state === "SUCCESS") {
                component.set('v.contactList',response.getReturnValue());
                helper.hideSpinner(component, event);
            }
        });
        $A.enqueueAction(action);
        helper.showSpinner(component, event);
    },
    addContact : function(component, event, helper) {
        console.log("In AddContact");
        //var recId = event.currentTarget.getAttribute("data-recordId");
        var recId =  component.get('v.loggedInUserContactId');
        
        $A.createComponent(
            "c:AddContact",
            {
                "recordId" : recId,
                "loggedInUserAccountType" : component.get("v.loggedInUserAccountType")
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
            }
        );
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
        
        console.log("In confirmContactDeactivate");
        
        var recId;
        var recordSelected = false;
        var selectedRadioButton = document.getElementsByClassName('radio');
        
        for (var i=0; i<selectedRadioButton.length; i++) {
            if (selectedRadioButton[i].checked) {
                
                recId = selectedRadioButton[i].getAttribute("data-RecId");
                recordSelected = true;
            }
        }
        
        if(!recordSelected) {
            
            var toastEvent = $A.get("e.force:showToast");           	
            toastEvent.setParams({
                "title": "Error",
                "message": "No record selected.",
                "type": "error",
                "duration":10000
            });
            toastEvent.fire();
        }
        else {
            
            $A.createComponent(
                "c:ModalMessageConfirmBox",
                {
                    "message": "If the contact type is a Nominated Director / Manager, this request will be submitted for review and approval by the Point to Point Transport Commission."
                    + "<br/><br/>&nbsp;Do you wish to continue?",
                    "confirmType": "Deactivate",
                    "recordId": recId,
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
        
        var recordId = event.getParam('recordId');
        helper.deactivateContact(component, event, recordId);
    },
    editContact : function(component, event, helper) {
        
        helper.editContact(component, event);
    },
})