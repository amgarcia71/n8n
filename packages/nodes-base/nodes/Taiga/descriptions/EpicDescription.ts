import {
	INodeProperties,
} from 'n8n-workflow';

export const epicOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'epic',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an epic',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an epic',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an epic',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all epics',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an epic',
			},
		],
		default: 'create',
	},
];

export const epicFields: INodeProperties[] = [
	// ----------------------------------------
	//               epic: create
	// ----------------------------------------
	{
		displayName: 'Project ID',
		name: 'projectId',
		description: 'ID of the project to which the epic belongs',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getProjects',
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'epic',
				],
				operation: [
					'create',
				],
			},
		},
	},
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'epic',
				],
				operation: [
					'create',
				],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'epic',
				],
				operation: [
					'create',
				],
			},
		},
		options: [
			{
				displayName: 'Assigned To',
				name: 'assigned_to',
				type: 'options',
				typeOptions: {
					loadOptionsDependsOn: [
						'projectId',
					],
					loadOptionsMethod: 'getUsers',
				},
				default: '',
				description: 'ID of the user to assign the epic to',
			},
			{
				displayName: 'Blocked Note',
				name: 'blocked_note',
				type: 'string',
				default: '',
				description: 'Reason why the epic is blocked. Requires "Is Blocked" toggle to be enabled.',
			},
			{
				displayName: 'Color',
				name: 'color',
				type: 'color',
				default: '0000FF',
				description: 'Color code in hexadecimal notation',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Is Blocked',
				name: 'is_blocked',
				type: 'boolean',
				default: false,
				description: 'Whether the issue is blocked',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsDependsOn: [
						'projectId',
					],
					loadOptionsMethod: 'getTags',
				},
				default: [],
			},
		],
	},

	// ----------------------------------------
	//               epic: delete
	// ----------------------------------------
	{
		displayName: 'Epic ID',
		name: 'epicId',
		description: 'ID of the epic to delete',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'epic',
				],
				operation: [
					'delete',
				],
			},
		},
	},

	// ----------------------------------------
	//                epic: get
	// ----------------------------------------
	{
		displayName: 'Epic ID',
		name: 'epicId',
		description: 'ID of the epic to retrieve',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'epic',
				],
				operation: [
					'get',
				],
			},
		},
	},

	// ----------------------------------------
	//               epic: getAll
	// ----------------------------------------
	{
		displayName: 'Project ID',
		name: 'projectId',
		description: 'ID of the project to which the epic belongs',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getProjects',
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'epic',
				],
				operation: [
					'getAll',
				],
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: [
					'epic',
				],
				operation: [
					'getAll',
				],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: [
					'epic',
				],
				operation: [
					'getAll',
				],
				returnAll: [
					false,
				],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: [
					'epic',
				],
				operation: [
					'getAll',
				],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Assigned To',
				name: 'assigned_to',
				type: 'options',
				typeOptions: {
					loadOptionsDependsOn: [
						'projectId',
					],
					loadOptionsMethod: 'getUsers',
				},
				default: '',
				description: 'ID of the user whom the epic is assigned to',
			},
			{
				displayName: 'Is Closed',
				name: 'statusIsClosed',
				description: 'Whether the epic is closed',
				type: 'boolean',
				default: false,
			},
		],
	},

	// ----------------------------------------
	//               epic: update
	// ----------------------------------------
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getProjects',
		},
		default: '',
		description: 'ID of the project to set the epic to',
		displayOptions: {
			show: {
				resource: [
					'epic',
				],
				operation: [
					'update',
				],
			},
		},
	},
	{
		displayName: 'Epic ID',
		name: 'epicId',
		description: 'ID of the epic to update',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'epic',
				],
				operation: [
					'update',
				],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'epic',
				],
				operation: [
					'update',
				],
			},
		},
		options: [
			{
				displayName: 'Assigned To',
				name: 'assigned_to',
				type: 'options',
				typeOptions: {
					loadOptionsDependsOn: [
						'projectId',
					],
					loadOptionsMethod: 'getUsers',
				},
				default: '',
				description: 'ID of the user to whom the epic is assigned',
			},
			{
				displayName: 'Blocked Note',
				name: 'blocked_note',
				type: 'string',
				default: '',
				description: 'Reason why the epic is blocked. Requires "Is Blocked" toggle to be enabled.',
			},
			{
				displayName: 'Color',
				name: 'color',
				type: 'color',
				default: '0000FF',
				description: 'Color code in hexadecimal notation',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Is Blocked',
				name: 'is_blocked',
				type: 'boolean',
				default: false,
				description: 'Whether the epic is blocked',
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsDependsOn: [
						'projectId',
					],
					loadOptionsMethod: 'getTags',
				},
				default: [],
			},
		],
	},
];
