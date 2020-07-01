@isTest
public class AuditNewNoticeControllerTest {
    
    @testSetup 
    static void setup() {
        Id ownerId = GlobalUtility.getOwnerId();
       
        Account aspAcc = new Account(name ='testASP', BillingStreet='Castlereagh Street', BillingCity='Sydney', BillingState='NSW', BillingPostalCode='2000', OwnerId=ownerId);
        insert aspAcc;
        
        Contact aspCon = new Contact(LastName ='testASPCon', firstName= 'test', AccountId = aspAcc.Id, Email='test@contest.com');
        insert aspCon;
       
        RecordType accountAuditRecordType = [SELECT Name FROM RecordType WHERE DeveloperName = 'Audit_Vendor' AND SobjectType = 'Account'];
        RecordType contactAuditRecordType = [SELECT Name FROM RecordType WHERE DeveloperName = 'Audit_Vendor' AND SobjectType = 'Contact'];
        RecordType caseAuditRecordType = [SELECT Name FROM RecordType WHERE DeveloperName = 'Audit' AND SobjectType = 'Case'];  
        
        Account ac = new Account(name ='testAuditor', BillingStreet='Castlereagh Street', BillingCity='Sydney', BillingState='NSW', BillingPostalCode='2000', OwnerId=ownerId);
        ac.RecordTypeId = accountAuditRecordType.Id;
        ac.Auditor_Type__c = 'External';
        ac.Auditor_Status__c = 'Active';
        ac.Equip_Vendor_Number__c = 'EVP1234';
        ac.Purchase_Order_Number__c = 'PO1234';
        insert ac;
        
        Case auditCase = new Case(AccountId = ac.Id, RecordTypeId = caseAuditRecordType.Id);
        auditCase.Audit_Vendor__c = ac.Id;
        auditCase.AccountId = aspAcc.Id;
        auditCase.ContactId = aspCon.Id;
        auditCase.Sub_Type__c = GlobalConstants.SAFETY_FULL_AUDIT_SUB_TYPE;
        auditCase.Status = 'In Progress';
        auditCase.Sub_Status__c = 'Planning';
        auditCase.Audit_Target_Start_Date__c = System.Today();
        auditCase.Audit_Target_End_Date__c = System.Today()+3;
        insert auditCase;
        
        Profile systemUserProfile = [SELECT Name FROM Profile WHERE Name = 'System Administrator'];
        User systemUser = new User(alias = 'test1234', email='test1234@noemail.com',
                                   emailencodingkey='UTF-8', lastname='Testing', languagelocalekey='en_US',
                                   localesidkey='en_US', profileid = systemUserProfile.Id, country='United States', IsActive =true,
                                   timezonesidkey='Australia/Sydney', username='tester89@noemail.com');
        
        insert systemUser;  
    }
    
    @isTest
    public static void getAuditCaseDetailsTest() {
        Case auditCase = [SELECT AccountId, Account.Notice_Address__c, ContactId, Account.Email__c,
                          Audit_Vendor__c, Id, Lead_Auditor__c, Lead_Auditor__r.Email, Assigned_Reviewer__c
                          ,Account.Notice_Email__c, Record_Type_Dev_Name__c FROM Case];
        
        // Case auditCase = [SELECT Id FROM Case];
        
        String a_id=auditCase.Id;
        Test.startTest();
        System.assertNotEquals(null,AuditNewNoticeController.getAuditCaseDetails(a_id));
        Test.stopTest();
    }
    
    @isTest
    public static void getLoggedinUsersDetailsTest() {
        User usrs = [SELECT Id FROM User where lastname='Testing' LIMIT 1];
        Test.startTest();
        System.assertNotEquals(null,AuditNewNoticeController.getLoggedinUsersDetails());
        Test.stopTest();
    }
    
    @isTest
    public static void getNoticeSubTypesTest() {
        Test.startTest();
        System.assertNotEquals(null,AuditNewNoticeController.getNoticeSubTypes('Audit Notice'));
        Test.stopTest();
    }
    
    @isTest
    public static void getRecordTypeAndDefaultValuesTest() {
        Test.startTest();
        System.assertNotEquals(null,AuditNewNoticeController.getRecordTypeAndDefaultValues('Audit Notice', 'Levy Investigation'));
        Test.stopTest();
    }
    
}