import { INodeProperties } from 'n8n-workflow';
import { endCustomerOperationDescription } from './EndCustomerOperationDescription';
export const resourceDescription: INodeProperties[] = [
	// --------------------------------------------------------------------------------------------------------------------------------------
	//            															Document
	// --------------------------------------------------------------------------------------------------------------------------------------
	{
		displayName: 'Operation',
		name: 'operationDocument',
		type: 'options',
		default: 'create',
		options: [
			{
				name: 'Create',
				value: 'create',
			},
			{
				name: 'Delete',
				value: 'delete',
			},
			{
				name: 'Get',
				value: 'get',
			},
			{
				name: 'Restore',
				value: 'restore',
			},
			{
				name: 'Send',
				value: 'send',
			},
			{
				name: 'Update',
				value: 'update',
			},
		],
		displayOptions: {
			show: {
				resource: ['document'],
			},
		},
	},
	// --------------------------------------------------------------------------------------------------------------------------------------
	//            															End Customer
	// --------------------------------------------------------------------------------------------------------------------------------------
	{
		displayName: 'Operation',
		name: 'operationEndCustomer',
		type: 'options',
		default: 'create',
		options: [
			{
				name: 'Create',
				value: 'create',
			},
			{
				name: 'Delete',
				value: 'delete',
			},
			{
				name: 'Get',
				value: 'get',
			},
			{
				name: 'Restore',
				value: 'restore',
			},
			{
				name: 'Update',
				value: 'update',
			},
		],
		displayOptions: {
			show: {
				resource: ['endCustomer'],
			},
		},
	},
];
