import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	OptionsWithUri,
} from 'request';

import {
	IBinaryData,
	IDataObject,
	IHookFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';

import {
	LoadedResource,
	ClingApiCredentials,
	LoadedTemplate,
	LoadedField,
} from './types';



export async function clingApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	apiToken:string,
	method: string,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
) {
	const credentials = await this.getCredentials('clingCredentialsApi') as ClingApiCredentials;
	const options: OptionsWithUri = {
		headers: {
			'authorization': `JWT ${apiToken}`,
		},
		method,
		body,
		qs,
		uri: `https://api.cling.se/${endpoint}`,
		json: true,
		gzip: true,
		rejectUnauthorized: true,
	};

	if (Object.keys(qs).length === 0) {
		delete options.qs;
	}

	if (Object.keys(body).length === 0) {
		delete options.body;
	}
	try {
		return await this.helpers.request!(options);
	} catch (error:any) {
		throw new NodeApiError(this.getNode(), error);
	}
}

export async function clingGetApiToken(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
) {
	const credentials = await this.getCredentials('clingCredentialsApi') as ClingApiCredentials;
	const options: OptionsWithUri = {
		headers:{},
		method:"post",
		body:{
			"email":credentials.email,
			"password":credentials.password,
		},
		uri: `https://api.cling.se/auth/companyUser`,
		json: true,
		gzip: true,
		rejectUnauthorized: true,
	};

	try {
		const authReply = await this.helpers.request!(options);
		return authReply.token;
	} catch (error:any) {
		throw new NodeApiError(this.getNode(), error);
	}



}

export const templateToOptions = (items: LoadedTemplate[]) =>
	items.map(({ name, _id }) => ({ name, value: _id }));

export const fieldsToOptions = (items: LoadedField[]) =>
	items.map(({ name, id }) => ({ name, value: id }));

export const toOptions = (items: LoadedResource[]) =>
	items.map(({ name, id }) => ({ name, value: id }));

