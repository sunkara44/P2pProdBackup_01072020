/**
 *  Description: Test class for CaseTriggerHelper class
*/
@isTest
public class CaseTriggerHelperTest {

	public static Integer count = 200;

	//Setup data
	@testSetup
	static void setup() {
		//Create ICC Escalation Cases
		Id caseICCEscRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByName().get('ICC Escalation').getRecordTypeId();
		List<Case> lCases = new List<Case> ();

		Set<String> ignoreFieldNames = new Set<String> ();
		ignoreFieldNames.add('Name');
		ignoreFieldNames.add('BusinessHoursId');

		Map<String, Object> caseValues;
		for (Integer i = 0; i<count; i++) {
			caseValues = new Map<String, Object> ();
			caseValues.put('RecordTypeId', caseICCEscRecordTypeId);
			caseValues.put('Status', 'New');
			caseValues.put('Description', 'Test Case-' + i);

			lCases.add((Case) TestDataFactory.createSObject('Case', caseValues, ignoreFieldNames));
		}
		insert lCases;
	}

	@istest
	static void change_iccescalation_case_recordtype_to_enquiry() {

		//Change the Owner of ICC case to Compliance Queue
		List<Case> lICCCases = [SELECT
		                        OwnerId
		                        FROM Case
		                        WHERE Record_Type_Dev_Name__c = :CaseTriggerHelper.CASE_RECORDTYPE_DEVNAME_ICC_ESCALATION];
		System.assertEquals(count, lICCCases.size());

		//Get Compliance Queue Id
		Id comlianceQueueId = [SELECT
		                       Id
		                       FROM Group
		                       WHERE Type = 'Queue'
		                       AND DeveloperName = :Label.Queue_DeveloperName_Compliance LIMIT 1].Id;
		//Assign all cases to compliance queues
		for (Case c : lICCCases) {
			c.OwnerId = comlianceQueueId;
		}

		Test.startTest();
		//Trigger update on case
		update lICCCases;
		Test.stopTest();

		lICCCases = [SELECT
		             Id
		             FROM Case
		             WHERE Record_Type_Dev_Name__c = :CaseTriggerHelper.CASE_RECORDTYPE_DEVNAME_ENQUIRY];
		//Assert on number of cases updated to Enquiry record type.
		System.assertEquals(count, lICCCases.size());
	}
/*
	@istest
	static void persist_case_age_test() {

		//Retrieve all cases
		List<Case> lCases = [SELECT
		                     Status
		                     FROM Case
		                     WHERE Record_Type_Dev_Name__c = :CaseTriggerHelper.CASE_RECORDTYPE_DEVNAME_ICC_ESCALATION];
		System.assertEquals(count, lCases.size());
		Test.startTest();
		//Mark All cases as Lodged
		for (Case c : lCases) {
			c.Status = GlobalConstants.APPLICATION_STATUS_LODGED;
		}
		update lCases;

		// Update the lodged timestamp on Cases to previous date
		lCases = [SELECT
		          Status,
		          Case_Lodged_TimeStamp__c
		          FROM Case WHERE Id IN :lCases];
		for (Case c : lCases) {
			//Change Case ldoge timestamp to previous date to get positive number in Case Age field
			c.Case_Lodged_TimeStamp__c = c.Case_Lodged_TimeStamp__c.addDays(- 5);
		}
		update lCases;

		// Change the status of the cases from Lodged to Draft
		for (Case c : lCases) {
			c.Status = GlobalConstants.APPLICATION_STATUS_DRAFT;
		}
		update lCases;
		Test.stopTest();

		//All cases should have Case_Age_Past__c updated to 5
		lCases = [SELECT
		          Id
		          FROM Case WHERE Id IN :lCases AND Case_Age_Past__c = 5];
		
		//Assert on count
		System.assertEquals(count, lCases.size());


	}
    */

}