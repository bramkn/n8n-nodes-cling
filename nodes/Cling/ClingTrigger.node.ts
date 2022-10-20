import { IHookFunctions, IWebhookFunctions } from 'n8n-core';

import {
	IDataObject,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';

import { clingApiRequest, clingGetApiToken } from './GenericFunctions';

export class ClingTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cling Trigger',
		name: 'clingTrigger',
		icon: 'file:cling.svg',
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when Cling events occur',
		defaults: {
			name: 'Cling Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'clingCredentialsApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
			{
				name: 'setup',
				httpMethod: 'GET',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				default: 'document.accepted',
				options: [
					{
						name: 'Document Accepted',
						value: 'document.accepted',
						description:
							"To get notified if a document is accepted",
					},
					{
						name: 'Document Created',
						value: 'document.created',
						description:
							"To get notified if a document is created",
					},
					{
						name: 'Document Denied',
						value: 'document.denied',
						description:
							"To get notified if a document is denied",
					},
					{
						name: 'Document Sent',
						value: 'document.sent',
						description:
							"To get notified if a document is sent",
					},
					{
						name: 'Document Viewed',
						value: 'document.viewed',
						description:
							"To get notified if a document is viewed",
					},
				],
			},
		],
	};

	// @ts-ignore (because of request)
	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const apiToken = await clingGetApiToken.call(this);
				const currentWebhookUrl = this.getNodeWebhookUrl('default') as string;
				const webhookData = this.getWorkflowStaticData('node');
				const event = this.getNodeParameter('event') as string;
				let exists = false;

				try {
					const data = await clingApiRequest.call(this,apiToken,'get','webhookSubscription',{},{}) as IDataObject[];
					const webhookdata = data.find(x => x.url === currentWebhookUrl && x.type === event);
					if(webhookdata !== undefined){
						webhookData.webhookId = webhookdata.id as string;
						exists = true;
					}

				} catch (error) {
					if (error.statusCode === 404) {
						return false;
					}
				}

				return exists;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const apiToken = await clingGetApiToken.call(this);
				const currentWebhookUrl = this.getNodeWebhookUrl('default') as string;
				const webhookData = this.getWorkflowStaticData('node');
				const event = this.getNodeParameter('event') as string;

				if(currentWebhookUrl.toLocaleLowerCase().startsWith('http') || currentWebhookUrl.toLocaleLowerCase().startsWith('www')){
					throw new NodeOperationError(this.getNode(), 'not a valid webhook URL, make sure to have an HTTPS url.');
				}

				const body = {
					type: event,
					isActive: true,
					url: currentWebhookUrl
				}

				try {

					const data = await clingApiRequest.call(this,apiToken,'post','webhookSubscription',body,{}) as IDataObject;
					if (data.id === undefined) {
						// Required data is missing so was not successful
						return false;
					}
					webhookData.webhookId = data.id as string;
					return true;

				} catch (error) {
						return false;
				}

			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const apiToken = await clingGetApiToken.call(this);
				const webhookData = this.getWorkflowStaticData('node');
				try {
					await clingApiRequest.call(this,apiToken,'delete',`webhookSubscription/${webhookData.webhookId}`,{},{}) as IDataObject;
				} catch (error) {
					return false;
				}
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		return {
			workflowData: [
				this.helpers.returnJsonArray({
					triggerEvent: req.body.type,
					createdAt: req.body.createdAt,
					...req.body,
				}),
			],
		};
	}
}
