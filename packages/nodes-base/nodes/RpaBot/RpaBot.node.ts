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
							displayName: 'RPA Workflow JSON',
							name: 'rpaJson',
							type: 'string',
							typeOptions: {
								alwaysOpenEditWindow: true,
								editor: 'json',
								rows: 10,
							},
							displayOptions: {
								show: {
									source: [
										'parameter',
									],
								},
							},
							default: '\n\n\n',
							required: true,
							description: 'The RPA workflow JSON code to execute',
						},


        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        return [[]];
    }
}
