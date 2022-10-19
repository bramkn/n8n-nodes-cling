import { IExecuteFunctions } from 'n8n-core';
import {
	IDataObject,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { documentOperationDescription } from './DocumentOperationDescription';
import { endCustomerOperationDescription } from './EndCustomerOperationDescription';
import { clingApiRequest, clingGetApiToken, fieldsToOptions, templateToOptions, toOptions } from './GenericFunctions';
import { resourceDescription } from './ResourceDescription';
import { LoadedField, LoadedResource, LoadedTemplate } from './types';

export class Cling implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cling Node',
		name: 'cling',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["resource"] }}',
		icon: 'file:cling.svg',
		description: 'Cling Node',
		defaults: {
			name: 'Cling',
		},
		credentials: [
			{
				name: 'clingCredentialsApi',
				required: true,
			},
		],
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'End Customer',
						value: 'endCustomer',
					},
					{
						name: 'Document',
						value: 'document',
					},
				],
				default: 'document',
			},
			...resourceDescription,
			...endCustomerOperationDescription,
			...documentOperationDescription,
		],
	};

	methods = {
		loadOptions: {
			async getTemplates(this: ILoadOptionsFunctions) {
				const apiToken = await clingGetApiToken.call(this);
				const data = await clingApiRequest.call(this,apiToken,'get','template');

				return templateToOptions(data.items as LoadedTemplate[]);
			},

			async getEndCustomers(this: ILoadOptionsFunctions) {
				const apiToken = await clingGetApiToken.call(this);
				const data = await clingApiRequest.call(this,apiToken,'get','endCustomer');

				return toOptions(data as LoadedResource[]);
			},

			async getFields(this: ILoadOptionsFunctions) {
				const templateId = this.getNodeParameter('templateId', '') as string;
				const apiToken = await clingGetApiToken.call(this);
				const data = await clingApiRequest.call(this,apiToken,'get',`template/${templateId}`);
				const fields = data.validationSchema.properties.data.properties.fields.default;
				const keys = Object.keys(fields);
				const fieldOptions:LoadedField[] = [];
				for(var key of keys){
					fieldOptions.push({
						id:key,
						name:fields[key].label
					})
				}

				return fieldsToOptions(fieldOptions as LoadedField[]);
			},
		},
	};

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `myString` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const apiToken = await clingGetApiToken.call(this);
		const returnItems: INodeExecutionData[] = [];

		const resource =  this.getNodeParameter('resource', 0, '') as string;

		// Iterates over all input items and add the key "myString" with the
		// value the parameter "myString" resolves to.
		// (This could be a different value for each item in case it contains an expression)
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
  // --------------------------------------------------------------------------------------------------------------------------------------
	//            															End Customer
	// --------------------------------------------------------------------------------------------------------------------------------------

				if(resource === "endCustomer"){
					const id = this.getNodeParameter('endCustomerId', itemIndex, '') as string;
					const operation = this.getNodeParameter('operationEndCustomer', 0, '') as string;

					if((operation !== "get" && id === "") && (operation !== "create" && id === "")){
						throw new NodeOperationError(this.getNode(), `Please enter the Id of the resource you want to perform the operation on`, {
							itemIndex,
						});
					}

					if(operation==="get"){
						if(id === ""){
							const filters = this.getNodeParameter('optionsEndCustomerGet', itemIndex, {}) as IDataObject;
							const data = await clingApiRequest.call(this,apiToken,'get',resource,{},filters);
							returnItems.push(...this.helpers.returnJsonArray(data));
						}
						else{
							const data = await clingApiRequest.call(this,apiToken,'get',`${resource}/${id}`,{},{});
							returnItems.push(...this.helpers.returnJsonArray(data));
						}
					}
					if(operation==="create" || operation==="update"){
						const bodyType = this.getNodeParameter('endCustomerBodyType', itemIndex, '') as string;
						let body = {};
						if(bodyType==="perField"){
							body = this.getNodeParameter('optionsEndCustomerPost', itemIndex, {}) as IDataObject;
						}
						else{
							const tempBody = this.getNodeParameter('endCustomerPostBody', itemIndex, '') as string;
							try{
								body = JSON.parse(tempBody);
							}
							catch{
								throw new NodeOperationError(this.getNode(), `Cannot parse body.`, {
									itemIndex,
								});
							}
						}
						let method = 'post';
						if(operation === 'update'){
							method = 'put';
						}
						const data = await clingApiRequest.call(this,apiToken,method,`${resource}`,body,{});
						returnItems.push(...this.helpers.returnJsonArray(data));
					}

					if(operation==="delete"){
						const data = await clingApiRequest.call(this,apiToken,'delete',`${resource}/${id}`,{},{});
						returnItems.push(...this.helpers.returnJsonArray(data));
					}
					if(operation==="restore"){
						const data = await clingApiRequest.call(this,apiToken,'patch',`${resource}/${id}`,{},{});
						returnItems.push(...this.helpers.returnJsonArray(data));
					}
				}

	// --------------------------------------------------------------------------------------------------------------------------------------
	//            															Document
	// --------------------------------------------------------------------------------------------------------------------------------------

				if(resource === "document"){
					const id = this.getNodeParameter('documentId', itemIndex, '') as string;
					const operation = this.getNodeParameter('operationDocument', 0, '') as string;
					if((operation !== "get" && id === "") && (operation !== "create" && id === "")){
						throw new NodeOperationError(this.getNode(), `Please enter the Id of the resource you want to perform the operation on`, {
							itemIndex,
						});
					}

					if(operation==="get"){
						if(id === ""){
							const filters = this.getNodeParameter('optionsdocumentGet', itemIndex, {}) as IDataObject;
							const data = await clingApiRequest.call(this,apiToken,'get',resource,{},filters);
							returnItems.push(...this.helpers.returnJsonArray(data.items));
						}
						else{
							const data = await clingApiRequest.call(this,apiToken,'get',`${resource}/${id}`,{},{});
							returnItems.push(...this.helpers.returnJsonArray(data));
						}
					}
					if(operation==="create" || operation==="update"){
						const bodyType = this.getNodeParameter('documentBodyType', itemIndex, '') as string;

						let fields:IDataObject = {};
						if(bodyType==="perField"){
							const tempFields = this.getNodeParameter('fields.field', itemIndex, []) as IDataObject[];
							for(var field of tempFields){
								fields[field.key as string] = {"value":field.value};
							}

						}
						else{
							const tempBody = this.getNodeParameter('documentPostBody', itemIndex, '') as string;
							try{
								fields = JSON.parse(tempBody);
							}
							catch{
								throw new NodeOperationError(this.getNode(), `Cannot parse body.`, {
									itemIndex,
								});
							}
						}
						let method = 'post';
						let requestBody:IDataObject ={};

						if(operation === 'update'){
							method = 'put';
							const documentName = this.getNodeParameter('documentName', itemIndex, '') as string;
							if(documentName!==""){
								requestBody.data = {
									name: documentName,
									fields};
							}
						}
						else{
							const templateId = this.getNodeParameter('templateId', itemIndex, '') as string;
							const endCustomerId = this.getNodeParameter('endCustomerId', itemIndex, '') as string;
							const documentName = this.getNodeParameter('documentName', itemIndex, '') as string;
							requestBody.templateId = templateId;
							requestBody.endCustomerId = endCustomerId;
							requestBody.data = {
								name: documentName,
								fields};
						}

						console.log(requestBody);

						const data = await clingApiRequest.call(this,apiToken,method,`${resource}`,requestBody,{});
						returnItems.push(...this.helpers.returnJsonArray(data));
					}

					if(operation==="delete"){
						const data = await clingApiRequest.call(this,apiToken,'delete',`${resource}/${id}`,{},{});
						returnItems.push(...this.helpers.returnJsonArray(data));
					}
					if(operation==="restore"){
						const data = await clingApiRequest.call(this,apiToken,'patch',`${resource}/${id}`,{},{});
						returnItems.push(...this.helpers.returnJsonArray(data));
					}

					if(operation==="send"){
						const data = await clingApiRequest.call(this,apiToken,'post',`${resource}/${id}/send`,{},{});
						returnItems.push(...this.helpers.returnJsonArray(data));
					}


				}


			} catch (error) {
				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return this.prepareOutputData(returnItems);
	}
}
