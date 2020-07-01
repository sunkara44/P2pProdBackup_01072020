/*******************************************************************************************
 * Author:         Abhi Indulkar
 * Company:        Transport for NSW
 * Description:    Helper class for Case Trigger utilities
 *
 * Test Class:   CaseTriggerHelperTest
 * History
 * <Date>      <Authors Name>      <Brief Description of Change>
 * 21/08/2018  Abhi Indulkar       Created
 *******************************************************************************************/

public without sharing class CaseTriggerHelper {
	public final static String CASE_RECORDTYPE_DEVNAME_ICC_ESCALATION = 'ICC_Escalation';
	public final static String CASE_RECORDTYPE_NAME_ENQUIRY = 'Enquiry';
	public final static String CASE_RECORDTYPE_DEVNAME_ENQUIRY = 'Enquiry';

	public static Map<Id, Group> mAllQueues = new Map<Id, Group> ();

	//P2PSUPPORT-121
	//Method to update Case Record Type
	public static void changeCaseRecordType(Map<Id, Case> pNewCases, Map<Id, Case> pOldCases) {

		//1. Change Case record Type to 'Enquiry', if ICC Escalation Case is assigned to new Compliance Queue
		Id enquiryCaseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByName().get(CASE_RECORDTYPE_NAME_ENQUIRY).getRecordTypeId();

		for (Case c : pNewCases.values()) {
			//Update only ICC Escalation Cases where owner changed to 'Compliance' Queue
			if (c.Record_Type_Dev_Name__c == CASE_RECORDTYPE_DEVNAME_ICC_ESCALATION
			    && getQueueById(c.OwnerId) != null
			    && getQueueById(c.OwnerId).DeveloperName == Label.Queue_DeveloperName_Compliance)
			{
				//Update Enquiry RecordType Id on Case. Before trigger context will facilitate update
				c.RecordTypeId = enquiryCaseRecordTypeId;
			}
		}
	}

	/**
	 * @author      Abhi Indulkar
	 * @date        07/08/2018
	 * @description	Retriev Queue By queue Id
	 *
	 * @param       Id QueueId
	 * @return      Group (Queue)
	 * @example     getQueueById(pQueueId)
	 *   
	 **/
	private static Group getQueueById(Id pQueueId)
	{
		if (mAllQueues.isEmpty()) {
			//populate map of Queues by QueueId
			mAllQueues = new Map<Id, Group> ([SELECT
			                                 Id,
			                                 DeveloperName
			                                 FROM Group
			                                 WHERE Type = 'Queue']);
		}

		return mAllQueues.get(pQueueId);
	}
}