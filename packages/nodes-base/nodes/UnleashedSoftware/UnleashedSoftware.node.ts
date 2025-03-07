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
	convertNETDates,
	unleashedApiRequest,
	unleashedApiRequestAllItems,
} from './GenericFunctions';

import {
	salesOrderFields,
	salesOrderOperations,
} from './SalesOrderDescription';

import {
	stockOnHandFields,
	stockOnHandOperations,
} from './StockOnHandDescription';

import moment from 'moment';

export class UnleashedSoftware implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Unleashed Software',
		name: 'unleashedSoftware',
		group: ['transform'],
		subtitle: '={{$parameter["operation"] + ":" + $parameter["resource"]}}',
		icon: 'file:unleashedSoftware.png',
		version: 1,
		description: 'Consume Unleashed Software API',
		defaults: {
			name: 'Unleashed Software',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'unleashedSoftwareApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Sales Order',
						value: 'salesOrder',
					},
					{
						name: 'Stock On Hand',
						value: 'stockOnHand',
					},
				],
				default: 'salesOrder',
			},
			...salesOrderOperations,
			...salesOrderFields,

			...stockOnHandOperations,
			...stockOnHandFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const length = items.length;
		const qs: IDataObject = {};
		let responseData;

		for (let i = 0; i < length; i++) {

			const resource = this.getNodeParameter('resource', 0) as string;
			const operation = this.getNodeParameter('operation', 0) as string;

			//https://apidocs.unleashedsoftware.com/SalesOrders
			if (resource === 'salesOrder') {

				if (operation === 'getAll') {

					const returnAll = this.getNodeParameter('returnAll', i) as boolean;
					const filters = this.getNodeParameter('filters', i) as IDataObject;

					if (filters.startDate) {
						filters.startDate = moment(filters.startDate as string).format('YYYY-MM-DD');
					}

					if (filters.endDate) {
						filters.endDate = moment(filters.endDate as string).format('YYYY-MM-DD');
					}

					if (filters.modifiedSince) {
						filters.modifiedSince = moment(filters.modifiedSince as string).format('YYYY-MM-DD');
					}

					if (filters.orderStatus) {
						filters.orderStatus = (filters.orderStatus as string[]).join(',');
					}

					Object.assign(qs, filters);

					if (returnAll) {
						responseData = await unleashedApiRequestAllItems.call(this, 'Items', 'GET', '/SalesOrders', {}, qs);
					} else {
						const limit = this.getNodeParameter('limit', i) as number;
						qs.pageSize = limit;
						responseData = await unleashedApiRequest.call(this, 'GET', `/SalesOrders`, {}, qs, 1);
						responseData = responseData.Items;
					}

					convertNETDates(responseData);
				}
			}

			//https://apidocs.unleashedsoftware.com/StockOnHand
			if (resource === 'stockOnHand') {

				if (operation === 'getAll') {
					const returnAll = this.getNodeParameter('returnAll', i) as boolean;

					const filters = this.getNodeParameter('filters', i) as IDataObject;

					if (filters.asAtDate) {
						filters.asAtDate = moment(filters.asAtDate as string).format('YYYY-MM-DD');
					}

					if (filters.modifiedSince) {
						filters.modifiedSince = moment(filters.modifiedSince as string).format('YYYY-MM-DD');
					}

					if (filters.orderBy) {
						filters.orderBy = (filters.orderBy as string).trim();
					}

					Object.assign(qs, filters);

					if (returnAll) {
						responseData = await unleashedApiRequestAllItems.call(this, 'Items', 'GET', '/StockOnHand', {}, qs);
					} else {
						const limit = this.getNodeParameter('limit', i) as number;
						qs.pageSize = limit;
						responseData = await unleashedApiRequest.call(this, 'GET', `/StockOnHand`, {}, qs, 1);
						responseData = responseData.Items;
					}

					convertNETDates(responseData);
				}

				if (operation === 'get') {
					const productId = this.getNodeParameter('productId', i) as string;
					responseData = await unleashedApiRequest.call(this, 'GET', `/StockOnHand/${productId}`);
					convertNETDates(responseData);
				}
			}

			if (Array.isArray(responseData)) {
				returnData.push.apply(returnData, responseData as IDataObject[]);
			} else {
				returnData.push(responseData as IDataObject);
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
