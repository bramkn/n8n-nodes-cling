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
	ClingApiCredentials,
	ClingApiTokenCredentials,
	LoadedArticles,
	LoadedField,
	LoadedResource,
	LoadedTemplate,
} from './types';



export async function clingApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	apiToken:string,
	method: string,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
) {
	const authenticationMethod = this.getNodeParameter(
		'authentication',
		0,
		'basicAuth',
	) as string;
	let auth = {};
	if(authenticationMethod ==='basicAuth'){
		auth = {authorization : `JWT ${apiToken}`};
	}
	else{
		auth = {apikey : `${apiToken}`};
	}
	const options: OptionsWithUri = {
		headers: {
			...auth,
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
		let i = 0;
		do {
			setTimeout(() => {  },  1000);
			try{
				const returnObjects = await this.helpers.request!(options);
				if(returnObjects !== undefined){
					return returnObjects;
				}
				else{
					i = i + 1;
				}
			}
			catch{
				i = i + 1;
			}

		} while (i < 25);
		return [];
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}

export async function clingGetApiToken(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
) {
	const authenticationMethod = this.getNodeParameter(
		'authentication',
		0,
		'basicAuth',
	) as string;

	if(authenticationMethod ==='basicAuth'){
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
			let i = 0;
		do {
			setTimeout(() => {  },  1000);
				try{
					const returnObjects = await this.helpers.request!(options);
					if(returnObjects !== undefined){
						return returnObjects.token;
					}
					else{
						i = i + 1;
					}
				}
				catch{
					i = i + 1;
				}

			} while (i < 25);
			return [];
		} catch (error) {
			throw new NodeApiError(this.getNode(), error);
		}
	}
	else{
		const credentials = await this.getCredentials('clingCredentialsApiTokenApi') as ClingApiTokenCredentials;
		return credentials.apiToken;
	}

}

export const templateToOptions = (items: LoadedTemplate[]) =>
	items.map(({ name, _id }) => ({ name, value: _id }));

export const articlesToOptions = (items: LoadedArticles[]) =>
	items.map(({ name }) => ({ name, value: name }));

export const fieldsToOptions = (items: LoadedField[]) =>
	items.map(({ name, id }) => ({ name, value: id }));

export const toOptions = (items: LoadedResource[]) =>
	items.map(({ name, id }) => ({ name, value: id }));

