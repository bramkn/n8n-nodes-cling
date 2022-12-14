import { INodeProperties } from 'n8n-workflow';
export const endCustomerOperationDescription: INodeProperties[] = [

	{
		displayName: 'ID',
		name: 'endCustomerId',
		type: 'string',
		default: '',
		description: 'End Customer ID',
		displayOptions: {
			show: {
				resource: ['endCustomer'],
				operationEndCustomer: ['get','update','delete','restore'],
			},
		},
	},




	// --------------------------------------------------------------------------------------------------------------------------------------
	//            															Get
	// --------------------------------------------------------------------------------------------------------------------------------------
	{
		displayName: 'Options',
		name: 'optionsEndCustomerGet',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['endCustomer'],
				operationEndCustomer: ['get'],
			},
		},
		options: [
			{
				displayName: 'Start',
				name: '_start',
				type: 'string',
				default: '0',
			},
			{
				displayName: 'End',
				name: '_end',
				type: 'string',
				default: '10',
			},
			{
				displayName: 'Sort',
				name: '_sort',
				type: 'string',
				default: 'createdAt',
			},
			{
				displayName: 'Order',
				name: '_order',
				type: 'options',
				options: [
					{
						name: 'DESC',
						value: 'desc',
					},
					{
						name: 'ASC',
						value: 'asc',
					},
				],
				default: 'desc',
			},
			{
				displayName: 'Where',
				name: '_where',
				type: 'string',
				default: '',
			},
		],
	},





	// --------------------------------------------------------------------------------------------------------------------------------------
	//            															Post
	// --------------------------------------------------------------------------------------------------------------------------------------

	{
		displayName: 'BodyType',
		name: 'endCustomerBodyType',
		type: 'options',
		options:[
			{
				name: 'Complete Body',
				value: 'completeBody',
			},
			{
				name: 'Per Field',
				value: 'perField',
			},
		],
		default: 'perField',
		description: 'Type of Body to set. complete body or per Field.',
		displayOptions: {
			show: {
				resource: ['endCustomer'],
				operationEndCustomer: ['update','create'],
			},
		},
	},
	{
		displayName: 'Body',
		name: 'endCustomerPostBody',
		type: 'string',
		default: '',
		description: 'Body to send in request',
		displayOptions: {
			show: {
				resource: ['endCustomer'],
				endCustomerBodyType: ['completeBody'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'optionsEndCustomerPost',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['endCustomer'],
				operationEndCustomer: ['create','update'],
				endCustomerBodyType: ['perField'],
			},
		},
		options: [
			{
				displayName: 'Reference',
				name: 'reference',
				type: 'string',
				default: '0',
			},
			{
				displayName: 'reverseVat',
				name: 'reverseVat',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'customerType',
				name: 'customerType',
				type: 'string',
				default: 'individual',
			},
			{
				displayName: 'Org_no',
				name: 'org_no',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
			},
			{
				displayName: 'Street',
				name: 'street',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Zip',
				name: 'zip',
				type: 'string',
				default: '',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Cellphone',
				name: 'cellphone',
				type: 'string',
				default: '',
			},
			{
				displayName: 'cellphoneRegion',
				name: 'cellphoneRegion',
				type: 'string',
				default: 'SE',
			},
			{
				displayName: 'separateWorkAddress',
				name: 'separateWorkAddress',
				type: 'string',
				default: '',
			},
			{
				displayName: 'workStreet',
				name: 'workStreet',
				type: 'string',
				default: '',
			},
			{
				displayName: 'workZip',
				name: 'workZip',
				type: 'string',
				default: '',
			},
			{
				displayName: 'workCity',
				name: 'workCity',
				type: 'string',
				default: '',
			},
			{
				displayName: 'vatNumber',
				name: 'vatNumber',
				type: 'string',
				default: '',
			},
			{
				displayName: 'externalId',
				name: 'externalId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				default: '',
			},
		],
	},
];


