({
	doInit : function (component, event, helper) {     
        console.log('ASPFormPartC_IndividualPartnership doInit');
        console.log('Case Id: '+ component.get("v.caseId"));
        var listObj = [];
        component.set('v.uploadStatus', listObj);
        
        if(component.get("v.caseId") == '' || component.get("v.caseId") == undefined) {
            helper.addRow(component, event);
        }
        else {
            helper.loadSectionData(component, event);
        }
    },
    partnershipDataChange : function(component, event, helper) {
        
        var selected = event.getSource().getLocalId();
        if(selected == "YesPartnershipData") {
            component.set("v.partnershipDataProvided", true);
            helper.addRow(component, event);
        }
        else {
            component.set("v.partnershipDataProvided", false);
        }
    },
    saveFormState : function(component, event, helper) {
        
        if(component.get("v.askUserChoiceForPartnershipData") == false) {
            
            if(helper.performBlankInputCheck(component, event)) {
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").style.display = 'block';
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").scrollIntoView();
                return;
            }
            else {
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").style.display = 'none';
                helper.saveSectionData(component, event, true, false);
            }
        }
        else if(component.get("v.partnershipDataProvided")) {
            
            if(helper.performBlankInputCheck(component, event)) {
                
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").style.display = 'block';
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").scrollIntoView();
                return;
            }
            else {
                
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").style.display = 'none';
                helper.saveSectionData(component, event, true, false);
            }
        }
        else {
            
            console.log("Partnership Data Not Provided !!!");
            
            if(helper.validateBlankRadioInputs(component, event, "PartnershipInfoError", component.get("v.partnershipDataProvided"))){
                
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").style.display = 'block';
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").scrollIntoView();
            }
            else {
                
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").style.display = 'none';
                helper.deleteAllExistingIndividualPartnershipData(component, event, true, false);
            }
        }
    },
    renderNextSection : function(component, event, helper) {
        
        if(component.get("v.askUserChoiceForPartnershipData") == false) {
            
            if(helper.performBlankInputCheck(component, event)) {
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").style.display = 'block';
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").scrollIntoView();
                return;
            }
            else {
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").style.display = 'none';
                helper.saveSectionData(component, event, false, false);
            }
        }
        else if(component.get("v.partnershipDataProvided")) {
            
            if(helper.performBlankInputCheck(component, event)) {
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").style.display = 'block';
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").scrollIntoView();
                return;
            }
            else {
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").style.display = 'none';
                helper.saveSectionData(component, event, false, false);
            }
        }
        else {
            
            console.log("Partnership Data Not Provided !!!");
            
            if(helper.validateBlankRadioInputs(component, event, "PartnershipInfoError", component.get("v.partnershipDataProvided"))){
                
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").style.display = 'block';
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").scrollIntoView();
            }
            else {
                
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").style.display = 'none';
                helper.deleteAllExistingIndividualPartnershipData(component, event, false, false);
            }
        }
    },
    confirmPrevSection : function(component, event, helper) {
        
        $A.createComponent(
            "c:ModalMessageConfirmBox",
            {
                "message": "Your changes on this page will be lost. Do you wish to proceed?",
                "confirmType": "ASP Form Previous"
            },
            function(newComponent, status, errorMessage) {
                console.log(status);
                //Add the new button to the body array
                if (status === "SUCCESS") {                        
                    var body = component.get("v.body");
                    body.push(newComponent);
                    component.set("v.body", body);
                } else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.");
                    // Show offline error
                } else if (status === "ERROR") {
                    console.log("Error: " + errorMessage);
                    // Show error message
                }  
            }
        );
    },
    renderPrevSection : function(component, event, helper) {
        
        var tempCaseId = component.get("v.caseId");
        var nextSectionEvent = component.getEvent("loadSection");
        
        if(component.get("v.entityType") == "Company Partner")
          nextSectionEvent.setParams({"sectionName": "sectionC-P", "caseId" : tempCaseId, "entityType" : component.get("v.entityType")});
        else
          nextSectionEvent.setParams({"sectionName": "sectionA", "caseId" : tempCaseId, "entityType" : component.get("v.entityType")});
        
        nextSectionEvent.fire();
    },
    editCurrentSection : function(component, event, helper) {
        
        component.set("v.readOnly", false);
        component.set("v.reviewEdit", true);
    },
    cancelReviewEdit : function(component, event, helper) {
        
        component.set("v.readOnly", true);
        component.set("v.reviewEdit", false);
        //$("#formPartC_IndividualPartnership .slds-has-error").removeClass("slds-has-error");
        //$("#formPartC_IndividualPartnership .slds-form-element__help").hide();
        document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").style.display = 'none';
        
        if(component.get("v.partnershipDataProvided"))
            helper.resetErrorMessages(component, event);
        
        helper.loadSectionData(component, event);
    },
    saveReviewChanges : function(component, event, helper) {
        
        if(component.get("v.askUserChoiceForPartnershipData") == false) {
            
            if(helper.performBlankInputCheck(component, event)) {
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").style.display = 'block';
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").scrollIntoView();
                return;
            }
            else {
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").style.display = 'none';
                helper.saveSectionData(component, event, false, false);
            }
        }
        else if(component.get("v.partnershipDataProvided")) {
            
            if(helper.performBlankInputCheck(component, event)) {
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").style.display = 'block';
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").scrollIntoView();
                return;
            }
            else {
                
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").style.display = 'none';
                component.set("v.readOnly", true);
                component.set("v.reviewEdit", false);
                helper.saveSectionData(component, event, false, true);
            }
        }
        else 
        {
            console.log("Partnership Data Not Provided !!!");
            
            if(helper.validateBlankRadioInputs(component, event, "PartnershipInfoError", component.get("v.partnershipDataProvided"))){
                
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").style.display = 'block';
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").scrollIntoView();
            }
            else {
                
                document.querySelector("#formPartC_IndividualPartnership #generalErrorMsgDiv").style.display = 'none';
                helper.deleteAllExistingIndividualPartnershipData(component, event, false, true);
            }
        }
    },
    addRow : function(component, event, helper) {
        
        helper.addRow(component, event);
    },
    removeRow : function (component, event, helper){     
        
        var index = event.target.id;
        console.log('ASPFormPartC_IndividualPartnership removeRow : ' + index);
        helper.removeRow(component, event, index);
    }
})