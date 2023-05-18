import { INodeProperties } from 'n8n-workflow';
export const documentOperationDescription: INodeProperties[] = [

	{
		displayName: 'ID',
		name: 'documentId',
		type: 'string',
		default: '',
		description: 'Document ID',
		displayOptions: {
			show: {
				resource: ['document'],
				operationDocument: ['get','update','delete','restore','send'],
			},
		},
	},
	{
		displayName: 'Template Name or ID',
		name: 'templateId',
		type: 'options',
		default: '',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		typeOptions: {
			loadOptionsDependsOn:['resource'],
			loadOptionsMethod: 'getTemplates',
		},
		displayOptions: {
			show: {
				resource: ['document'],
				operationDocument: ['create'],
			},
		},
	},
	{
		displayName: 'End Customer Names or IDs',
		name: 'endCustomerId',
		type: 'multiOptions',
		default: [],
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
		typeOptions: {
			loadOptionsDependsOn:['resource'],
			loadOptionsMethod: 'getEndCustomers',
		},
		displayOptions: {
			show: {
				resource: ['document'],
				operationDocument: ['create'],
			},
		},
	},





	// --------------------------------------------------------------------------------------------------------------------------------------
	//            															Get
	// --------------------------------------------------------------------------------------------------------------------------------------
	{
		displayName: 'Options',
		name: 'optionsDocumentGet',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['document'],
				operationDocument: ['get'],
			},
		},
		options: [
			{
				displayName: 'includeVersions',
				name: 'includeVersions',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'includeTemplate',
				name: 'includeTemplate',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'includeEvents',
				name: 'includeEvents',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'returnType',
				name: 'returnType',
				type: 'options',
				options: [
					{
						name: 'Minimal',
						value: 'minimal',
					},
					{
						name: 'Full',
						value: 'full',
					},
				],
				default: 'minimal',
			},
			{
				displayName: 'Skip',
				name: 'skip',
				type: 'string',
				default: '0',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'string',
				default: '10',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'string',
				default: '-createdAt',
				description: 'Sort on property (- for desc)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'string',
				default: '',
			},
		],
	},





	// --------------------------------------------------------------------------------------------------------------------------------------
	//            															Post
	// --------------------------------------------------------------------------------------------------------------------------------------

	{
		displayName: 'Document Name',
		name: 'documentName',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['document'],
				operationDocument: ['create'],
			},
		},
	},
	{
		displayName: 'BodyType',
		name: 'documentBodyType',
		type: 'options',
		options:[
			{
				name: 'Complete Fields Object',
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
				resource: ['document'],
				operationDocument: ['update','create'],
			},
		},
	},
	{
		displayName: 'Fields',
		name: 'fields',
		placeholder: 'Add Field',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			sortable: true,
		},
		description: 'Record to create',
		default: {},
		displayOptions: {
			show: {
				resource: ['document'],
				operationDocument: ['create'],
				documentBodyType: ['perField'],
			},
		},
		options: [
			{
				name: 'field',
				displayName: 'Field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'key',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getFields',
							loadOptionsDependsOn:['templateId'],
						},
						default: '',
						description: 'Key of the field to assign a value to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value of the field',
					},
				],
			},
		],
	},
	{
		displayName: 'Articles',
		name: 'articles',
		placeholder: 'Add Article',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			sortable: true,
		},
		description: 'Articles to Add',
		default: {},
		displayOptions: {
			show: {
				resource: ['document'],
				operationDocument: ['create'],
				documentBodyType: ['perField'],
			},
		},
		options: [
			{
				name: 'article',
				displayName: 'Article',
				values: [
					{
						displayName: 'Article Name or ID',
						name: 'key',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getArticles',
							loadOptionsDependsOn:['templateId'],
						},
						default: '',
						description: 'Key of the article to assign a value to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Field',
						name: 'field',
						type: 'options',
						options:[
							{
								name: 'Price',
								value: 'price',
							},
							{
								name: 'Quantity',
								value: 'quantity',
							},
						],
						default: 'quantity',
						description: 'Field of the article',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'number',
						default: 0,
						description: 'Value of the article field',
					},
				],
			},
		],
	},
	{
		displayName: 'Fields',
		name: 'updateFields',
		placeholder: 'Add Field',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			sortable: true,
		},
		description: 'Record to create',
		default: {},
		displayOptions: {
			show: {
				resource: ['document'],
				operationDocument: ['update'],
				documentBodyType: ['perField'],
			},
		},
		options: [
			{
				name: 'field',
				displayName: 'Field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'key',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getFields',
							loadOptionsDependsOn:['documentId'],
						},
						default: '',
						description: 'Key of the field to assign a value to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value of the field',
					},
				],
			},
		],
	},
	{
		displayName: 'Fields Object',
		name: 'documentPostBody',
		type: 'string',
		default: '',
		description: 'Body to send in request',
		displayOptions: {
			show: {
				resource: ['document'],
				operationDocument: ['update','create'],
				documentBodyType: ['completeBody'],
			},
		},
	},
];


