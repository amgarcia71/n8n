import { AnySrvRecord } from 'dns';
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
							displayName: 'Source',
							name: 'source',
							type: 'options',
							options: [
								{
									name: 'Database',
									value: 'database',
									description: 'Load the workflow from the database by ID',
								},
								{
									name: 'Local File',
									value: 'localFile',
									description: 'Load the workflow from a locally saved file',
								},
								{
									name: 'Parameter',
									value: 'parameter',
									description: 'Load the workflow from a parameter',
								},
								{
									name: 'URL',
									value: 'url',
									description: 'Load the workflow from an URL',
								},
							],
							default: 'database',
							description: 'Where to get the workflow to execute from',
						},

						// ----------------------------------
						//         source:database
						// ----------------------------------
						{
							displayName: 'Workflow ID',
							name: 'workflowId',
							type: 'string',
							displayOptions: {
								show: {
									source: [
										'database',
									],
								},
							},
							default: '',
							required: true,
							description: 'The workflow to execute',
						},

						// ----------------------------------
						//         source:localFile
						// ----------------------------------
						{
							displayName: 'Workflow Path',
							name: 'workflowPath',
							type: 'string',
							displayOptions: {
								show: {
									source: [
										'localFile',
									],
								},
							},
							default: '',
							placeholder: '/data/workflow.json',
							required: true,
							description: 'The path to local JSON workflow file to execute',
						},

						// ----------------------------------
						//         source:parameter
						// ----------------------------------
						{
							displayName: 'Workflow JSON',
							name: 'workflowJson',
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
							description: 'The workflow JSON code to execute',
						},

						// ----------------------------------
						//         source:url
						// ----------------------------------
						{
							displayName: 'Workflow URL',
							name: 'workflowUrl',
							type: 'string',
							displayOptions: {
								show: {
									source: [
										'url',
									],
								},
							},
							default: '',
							placeholder: 'https://example.com/workflow.json',
							required: true,
							description: 'The URL from which to load the workflow from',
						},
						{
							displayName: 'Any data you pass into this node will be output by the start node of the workflow to be executed. <a href="https://docs.n8n.io/nodes/n8n-nodes-base.executeworkflow/" target="_blank">More info</a>',
							name: 'executeWorkflowNotice',
							type: 'notice',
							default: '',
						},


        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {


			const workflowJson = this.getNodeParameter('workflowJson', 0) as string;
			const RPAJSON = JSON.parse(workflowJson) as JSON;

			var rpa =  new RPA_Bot(RPAJSON);

			//rpa.inputContext["input"] = 	this.getInputData();


			let res = await rpa.exec();

			// Map data to n8n data
			return [this.helpers.returnJsonArray(res)];
		}


}


'use strict';


//const puppeteer = require('puppeteer');
const HtmlTableToJson = require('html-table-to-json');
const puppeteer = require('puppeteer-extra')
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')

puppeteer.use(
    RecaptchaPlugin({
      provider: {
        id: '2captcha',
        token: 'c39681ac6e4b9bde006dfd0d15f13345' // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
      },
      visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
    })
  )

const cvocrModule = require("captcha-cv-ocr");
var userAgent = require('user-agents');






class  RPA_Bot{
	context: any;
	inputContext: any;
	flowData: any;
	browser: any;
	currentPageName: any;
	page: any;
	currentPage: any;
	timeout: any;
   constructor(flowData: JSON){
        this.flowData = flowData ;        ;
        this.context = {};
        this.browser ;
        this.page={};
        this.currentPageName;
				this.currentPage;
        this.timeout = 5000;

    }



    // Recieve a Msg from Router
    async exec(){

            this.browser =  await puppeteer.launch({ headless: this.flowData["headless"] });
            var currentStep =  this.flowData.steps[this.flowData.init];

            await this.execStep(currentStep, "init");
            this.browser.close();
            return {status: 200, input: this.inputContext ,  output : this.context  };



    }




    async execStep(step: { name: string; actions: string | any[]; transitions: string | any[]; }, source: string | undefined){


        console.log ("------------------ Step " + step.name + "----------------" );


        for (var a = 0; a < step.actions.length  ; a++) {

            await this.execAction(step.actions[a], source);

            // Log Action

            var keys = Object.keys(step.actions[a].params);
            var sAction = a+1 +") " + step.actions[a].name;

            for (var i = 0; i < keys.length; i++) {
                sAction = sAction + " , " + keys[i] + " = " + step.actions[a].params[keys[i]] + " , "
            }

            console.log( sAction , (step.actions[a].params.variable?  "context => " + step.actions[a].params.variable + " = " + this.context[ step.actions[a].params.variable ] : "" )+"\n" ) ;


        };

        for (var t = 0; t < step.transitions.length  ; t++) {
            await this.execTransition(step.transitions[t], source);

        };

        return true;


    }

    async execTransition(transition: { type: any; transition: string | number; valiue: any; operator: string; variable: string | number; value: string | number; variable2: string | number; }, source: any){




        switch (transition.type) {
                case "to":

                    await this.execStep(this.flowData.steps[transition.transition],undefined);

                break;

                case "if":

                    if (transition.valiue && transition.operator == "=" ){

                        if ( this.context[transition.variable] == this.context[transition.value] ){
                            await this.execStep(this.flowData.steps[transition.transition],undefined);
                        }
                    };

                    if (transition.valiue && transition.operator == "!=" ){

                        if ( this.context[transition.variable] != this.context[transition.value] ){
                            await this.execStep(this.flowData.steps[transition.transition],undefined);
                        }
                    };

                    if (transition.variable2 && transition.operator == "=" ){

                        if ( this.context[transition.variable] == this.context[transition.variable2] ){
                            await this.execStep(this.flowData.steps[transition.transition],undefined);
                        }
                    };

                    if (transition.variable2 && transition.operator == "!=" ){

                        if ( this.context[transition.variable] != this.context[transition.variable2] ){
                            await this.execStep(this.flowData.steps[transition.transition],undefined);
                        }
                    };




                    break;

                case "function":

                    break;



            }
    }

    async execAction(action: { name: string; params: { name: string ; url: string; selector: string; timeout: number; transition: string ; variable: string ; attribute: string; value: any; srcVariable: string; retry: number; refreshSelector: number; refreshTransition: number; length: number; path: string; errorTransition: string; operator: string; method: string; }; }, source: string | undefined){

        switch (action.name) {
            case "openPage":
                if (this.currentPageName  != action.params.name) {


                    this.page[action.params.name] = await this.browser.newPage();
                    this.currentPage = this.page[action.params.name] ;
                    this.currentPageName = action.params.name;

                }

                break;

            case "goto":
                const uagent =  new userAgent();
                await this.currentPage.setUserAgent(uagent.toString())

                await this.currentPage.goto(action.params.url);
                break;

            case "waitForSelector":

                try {
                    await this.currentPage.waitForSelector(action.params.selector, {timeout: (action.params.timeout ? action.params.timeout : this.timeout) });
                } catch (e) {

                    console.log("Error : waitForSelector ", action.params.transition , e.message);

                        if (action.params.transition  ){

                                console.log("Error : waitForSelector , go to transition ",action.params.transition );

                                await this.execStep(this.flowData.steps[action.params.transition],undefined);

                        };


                };

                break;

            case "setValue":

                if (action.params.variable){
                    await this.currentPage.evaluate((variable: any, selector: any, attribute: string | number ) => {
                         document.querySelector(selector)[attribute] = variable; // es pasado por parametro y tiener el valor de result_code

                      }, this.context[action.params.variable] , action.params.selector , action.params.attribute ); // valor real a ingresar

                };

                if (action.params.value){
                    await this.currentPage.evaluate((value: any, selector: any, attribute: string | number) => {
                         document.querySelector(selector)[attribute] = value; // es pasado por parametro y tiener el valor de result_code

                      }, action.params.value, action.params.selector , action.params.attribute); // valor real a ingresar

                };

                break;

            case "getValue":

                this.context[action.params.variable] = await this.currentPage.evaluate((selector: any, attribute: string | number) => {
                    const obj =  document.querySelector(selector);

                    return obj[attribute];
                }, action.params.selector , action.params.attribute  );

                break;

            case "getTableValues":

                    var tableHtml = await this.currentPage.evaluate((selector: any) => {
                        const obj =  document.querySelector(selector);

                        return obj.innerHTML;
                    }, action.params.selector   );


                    this.context[action.params.variable] = await scrapTable(tableHtml);

                    break;

            case "getCaptcha":

                await this.getCaptcha(action.params.srcVariable, action.params.variable, action.params.retry,action.params.refreshSelector, action.params.refreshTransition,action.params.length );

                break;

            case "getScreenShot":
                await this.currentPage.screenshot({ path: action.params.path });

            break;
            case "click":

                try{

                    await Promise.all([
                        await this.currentPage.click(action.params.selector),
                        await this.currentPage.waitForNavigation({ waitUntil: 'domcontentloaded' , timeout: (action.params.timeout ? action.params.timeout : this.timeout)  })

                  ]);

                }catch(err){

                    console.log("Error on click : waitForNavigation ", action.params.errorTransition , err.message);



                }


                break;

            case "waitForTimeout":
                try {
                    await this.currentPage.waitForTimeout(action.params.value)
                } catch (error) {
                    console.log("waitForTimeout Error ", error.message)

                }

                break;

            case "waitWhile":
                var count = 1;

                if (action.params.operator == "!="){


                    if (action.params.variable){

                        while ( this.context[action.params.variable] !=  action.params.value ) {

                            count++;

                        };

                    };

                    if (action.params.selector){

                        while (

                            action.params.value != await this.currentPage.evaluate((selector: any, attribute: string | number) => {
                            const obj =  document.querySelector(selector);

                            return obj[attribute];
                        }, action.params.selector , action.params.attribute  )

                    ) {
                            count++;
                        };

                    };
                }

                if (action.params.operator == "="){


                    if (action.params.variable){

                        while ( action.params.value  == this.context[action.params.variable] ) {

                            count++;

                        };

                    };

                    if (action.params.selector){

                        while (

                            action.params.value ==  await this.currentPage.evaluate((selector: any, attribute: string | number) => {
                            const obj =  document.querySelector(selector);

                            return obj[attribute];
                        }, action.params.selector , action.params.attribute  )

                    ) {

                                 count++;

                        };

                    };
                }


                break;

            case "avoidAlert":



                        if (action.params.method == "ok") {



                            this.currentPage.eventsMap.delete('dialog');
                            this.currentPage.on('dialog', async (dialog: { accept: () => void; }) => {


                                    dialog.accept();



                            });


                        }
        ``
                        if (action.params.method == "cancel") {

                            this.currentPage.eventsMap.delete('dialog');
                            this.currentPage.on('dialog', async (dialog: { dismiss: () => void; }) => {


                                    dialog.dismiss();

                            });

                        }



                    break;


            case "function":


            break;

            case "rest":


            break;
            case "saveContext":

                const fs = require('fs');

                let data = JSON.stringify(this.context, undefined , 2);
                fs.writeFileSync(action.params.name, data);


            break;


            case "solveReCaptcha":

                /*

                const elementHandle = await this.currentPage.waitForSelector(action.params.selector);
                const frame = await elementHandle.contentFrame();
                await frame.waitForSelector("#recaptcha-anchor");
                const checkbox = await frame.$('#recaptcha-anchor')

                */

                await this.currentPage.solveRecaptchas()



                break;

            default:



          };

          return true;


    }

    getContextObject(path: string){
        var aPath = path.split(".");
        var obj = this.context;

        try {
            aPath.forEach((objName: string | number) =>{
              obj = obj[objName];
            })

            return obj;
          } catch (error) {
            console.error(error);
            return obj;
          }


    }


    async getCaptcha(src: string | number, variable: string | number, retry: number,refreshSelector: any,refreshTransition: string | number, length: number)  {
        var mode = "simplest";
        let cvocr = new cvocrModule(mode);
        await cvocr.init(1);

        var result_code = "";
        var ans={ result:""};
        var count = 1;



        while (result_code.length < length && count <= retry) {

            ans = await cvocr.recognize( this.context[src] );
            result_code = ans.result;
            count++;

        };


        if (refreshSelector && (result_code.length < length ) ){


            await this.currentPage.click(refreshSelector);

            if (refreshTransition){
                await this.execStep(this.flowData.steps[refreshTransition], "GetCaptcha");

            }

        }

        this.context[variable] = result_code ;
        return;

    }



}





const request = require('request');

// wrap a request in an promise
function downloadPage(url: any) {
    return new Promise((resolve, reject) => {
        request(url, (error: any, response: { statusCode: string | number; }, body: unknown) => {
            if (error) reject(error);
            if (response.statusCode != 200) {
                reject('Invalid status code <' + response.statusCode + '>');
            }
            resolve(body);
        });
    });
}

// wrap a request in an promise
function postUrl(url: string, bPost: boolean) {
    return new Promise((resolve, reject) => {
        request.post({
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            url:     'http://localhost/test2.php',
            body:    bPost
          }, (error: any, response: { statusCode: string | number; }, body: unknown) => {
            if (error) reject(error);
            if (response.statusCode != 200) {
                reject('Invalid status code <' + response.statusCode + '>');
            }
            resolve(body);
        });
    });
}



function rdn(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
  }


function result(result: any, any: any): any {
	throw new Error('Function not implemented.');
}


async function scrapTable(table : string ) : Promise<any> {

	const cheerio = require('cheerio');



			var HTML = '<table>' + table + '</table>';
			const $ = cheerio.load(HTML);

			var trs = $('tr');
			var header = [];
			var colspan = [];
			var index = 0;
			var maxRowspan = 0;

			while (index < trs.length) {
					var tr = trs[index];
					index++;
					if (!tr) continue;

					var columnNames = $(tr).children();
					var tempHead = [];
					var tempColspan = [];
					for (let i = 0; i < columnNames.length; i++) {
							var col = $(columnNames[i]);
							tempHead.push(col.text().trim().replace(/[^a-zA-Z0-9]/g, '_'))
							tempColspan.push(Number(col.attr('colspan')) ? Number(col.attr('colspan')) : 1)
							maxRowspan = col.attr('rowspan') ? Math.max(maxRowspan, Number(col.attr('rowspan'))) : maxRowspan;
					}

					header.push(tempHead);
					colspan.push(tempColspan);

					if (tempColspan.length != 0 && tempColspan.every(x => x == 1)) {
							break;
					}
			}

			header = header.filter(x => x.length != 0)
			colspan = colspan.filter(x => x.length != 0)

			for (let i = colspan.length - 1; i >= 0; i--) {
					// first for loop
					let tempArray = [];
					let k = 0;

					for (let j = 0; j < colspan[i].length; j++) {
							// second for loop
							if (colspan[i][j] == 1) {
									tempArray.push(header[i][j]);
							} else {
									while (colspan[i][j] != 0) {
											colspan[i][j] -= 1;
											tempArray.push(`${header[i][j]}_${header[i + 1][k]}`);
											k++;
									}
							}

					} //end of second for loop
					header[i] = tempArray;
			} //end of first for loop

			var headerKeys = header[0];
			console.log(maxRowspan)
			if (index < maxRowspan) index = maxRowspan;
			// ....................................
			// getting actual data from the table
			// ...................................
			var actualData = [];
			while (index < trs.length) {
					var tr = trs[index];
					index++;
					// const tds = $(tr).find('td');
					const tds = $(tr).children();
					const rowData = Array.from(tds, td => {
							var tdText = $(td).text().trim()
							if (isNumeric(tdText)) {
									return Number(tdText);
							}
							return tdText;
					});
					var obj : any = {}
					rowData.forEach((data, i) => {
							obj[headerKeys[i]] = data;
					})
					actualData.push(obj);
			}

			actualData = actualData.filter(x => Object.keys(x).length >= headerKeys.length-2);
		  return  actualData;



}

function csvConverter(data : any ) {
	if (typeof data == 'string') data = JSON.parse(data);
	var csvString = '';
	var header = Object.keys(data[0]);
	csvString += header.join(',') + '\r\n'
	for (let i = 0; i < data.length; i++) {
			var line = '';
			let obj = data[i];
			let objValues = Object.values(obj);
			if (objValues.length < header.length) continue;
			line = objValues.join(',');
			csvString += line + '\r\n';
	}
	return csvString;
}

function isNumeric(value : any ) {
	return /^-?\d+$/.test(value);
}

