import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ClingCredentialsApiTokenApi implements ICredentialType {
	name = 'clingCredentialsApiTokenApi';
	displayName = 'Cling Api Token API';
	properties: INodeProperties[] = [
		{
			displayName: 'ApiToken',
			name: 'apiToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
}
