/**
* Server side rest resource controller for creating new audit 
*/
public with sharing class AuditNewNoticeController {
    
    @AuraEnabled
    public static List<String> getNoticeSubTypes(String selectedNoticeType){
        List<String> options = new List<String>();
        
        List<Audit_Notice_Records_Config__mdt> auditNoticesConfigMDT = AuditNoticesConfiguration.get();
        for(Audit_Notice_Records_Config__mdt metadataRecord : auditNoticesConfigMDT) {
            
            if(metadataRecord.Type__c.equals(selectedNoticeType)) {
                options.add(metadataRecord.Sub_Type__c);
            }
        }
       
        options.sort();
        return options;
    }
    
    @AuraEnabled
    public static Case getAuditCaseDetails(String auditCaseId){
        
        Case auditCase = [SELECT AccountId, Account.Notice_Address__c, ContactId, Account.Email__c,
                          Audit_Vendor__c, Id, Lead_Auditor__c, Lead_Auditor__r.Email, Assigned_Reviewer__c,
                          Account.Notice_Email__c, Record_Type_Dev_Name__c, Audit_Target_End_Date__c, Sub_Status__c 
                          FROM Case WHERE Id = :auditCaseId];
        
        return auditCase;
    }
    
    @AuraEnabled
    public static User getLoggedinUsersDetails() {
        
        return GlobalUtility.getLoggedInUser();
    }  
    
    @AuraEnabled
    public static Audit_Notice_Records_Config__mdt getRecordTypeAndDefaultValues(String selectedNoticeType, String selectedNoticeSubType) {
        
        Audit_Notice_Records_Config__mdt result = null;
        
        List<Audit_Notice_Records_Config__mdt> auditNoticesConfigMDT = AuditNoticesConfiguration.get();
        for(Audit_Notice_Records_Config__mdt metadataRecord : auditNoticesConfigMDT) {
            
            if(metadataRecord.Type__c.equals(selectedNoticeType) && metadataRecord.Sub_Type__c.equals(selectedNoticeSubType)) {
                result = metadataRecord;
            }
        }
        
        return result;
    }
}