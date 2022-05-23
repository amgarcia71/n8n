import {
    IExecuteFunctions,
} from 'n8n-core';

import {
    IDataObject,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

import {
    OptionsWithUri,
} from 'request';

export class RpaBot implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'RpaBot',
        name: 'RpaBot',
        icon: 'file:RpaBot.png',
        group: ['transform'],
        version: 1,
        description: 'RpaBot Node',
        defaults: {
            name: 'RpaBot',
            color: '#1A82e2',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
        ],
        properties: [
            // Node properties which the user gets displayed and
            // can change on the node.

						{
							displayName: 'Resource',
							name: 'resource',
							type: 'options',
							options: [
									{
											name: 'Contact',
											value: 'contact',
									},
							],
							default: 'contact',
							required: true,
							description: 'Resource to consume',
					},
					{
							displayName: 'Operation',
							name: 'operation',
							type: 'options',
							displayOptions: {
									show: {
											resource: [
													'contact',
											],
									},
							},
							options: [
									{
											name: 'Create',
											value: 'create',
											description: 'Create a contact',
									},
							],
							default: 'create',
							description: 'The operation to perform.',
					},
					{
							displayName: 'Email',
							name: 'email',
							type: 'string',
							required: true,
							displayOptions: {
									show: {
											operation: [
													'create',
											],
											resource: [
													'contact',
											],
									},
							},
							default:'',
							description:'Primary email for the contact',
					},

        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        return [[]];
    }
}
