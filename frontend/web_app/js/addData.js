import { getToken, getUrl, getProtocol } from './auth.js';
const apiUrl = getUrl();
const token = getToken();
const protocol = getProtocol();
let selectedDataModelId = null;
let selectedTableSchema = null;
let selectedDataModel = null;
let selectedTable = null;
let selectedColumn = null;
let selectedButton = null;
let selectedColumnId = null;

const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
const newGUID = generateGUID();
let customCodeTableName;



function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

async function fetchDatamodels(apiUrl, headers) {
    const endpoint = `${protocol}://${apiUrl}/api/v2/datamodels/schema`;
    const response = await fetch(endpoint, { method: 'GET', headers });
    if (!response.ok) throw new Error('Failed to fetch DataModels');
    const data = await response.json();
    return data.filter(item => item);
}

async function fetchDatasets(apiUrl, dataModel, headers) {
    const endpoint = `${protocol}://${apiUrl}/api/v2/datamodels/${dataModel}/schema/datasets`;
    const response = await fetch(endpoint, { method: 'GET', headers });
    if (!response.ok) throw new Error('Failed to fetch datasets');
    return await response.json();
}

async function fetchTables(apiUrl, dataModel, datasets, headers) {
    const requests = datasets.map(data => {
        const endpoint = `${protocol}://${apiUrl}/api/v2/datamodels/${dataModel}/schema/datasets/${data.oid}/tables`;
        return fetch(endpoint, { method: 'GET', headers }).then(response => response.json());
    });
    const tables = await Promise.all(requests);
    return tables.flat();
}

function showColumn(clickedTable, tables) {
    const selectedTable = tables.find(table => table.name === clickedTable);

    if (selectedTable) {
        selectedTableSchema = selectedTable;
        return selectedTable.columns.map(column => column.name);
    }
    return null;
}

function showLoadingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'loading-indicator';
    indicator.textContent = 'Loading...';
    document.body.appendChild(indicator);
}

function hideLoadingIndicator() {
    const indicator = document.querySelector('.loading-indicator');
    if (indicator) indicator.remove();
}

function createDataTable(dataArray, containerId, tableId, headerText, rowClickCallback) {
    const container = document.getElementById(containerId);
    const table = document.createElement('table');
    table.id = tableId;

    // Create and style the header
    const header = table.createTHead().insertRow();
    const headerCell = document.createElement('th');
    headerCell.textContent = headerText;
    headerCell.className = 'custom-table-header';
    header.appendChild(headerCell);

    const tbody = table.createTBody();
    dataArray.forEach(item => {
        const row = tbody.insertRow();
        const cell = row.insertCell();
        const button = document.createElement('button');
        button.textContent = item.title || item;
        button.className = 'clickable-button';
        button.addEventListener('click', () => {
            document.querySelectorAll('.dm-button-clicked').forEach(el => el.classList.remove('dm-button-clicked'));
            button.classList.add('dm-button-clicked');
            rowClickCallback(item);
        });
        cell.appendChild(button);
    });

    container.innerHTML = '';
    container.appendChild(table);
}

function createCategoryButtons(callback) {
    const container = document.createElement('div');
    ['CLASSIFICATION', 'REGRESSION'].forEach(label => {
        const button = document.createElement('button');
        button.textContent = label;
        button.className = 'category-button';
        button.addEventListener('click', () => {
            document.querySelectorAll('.category-button-clicked').forEach(el => el.classList.remove('category-button-clicked'));
            button.classList.add('category-button-clicked');
            callback(label);
        });
        container.appendChild(button);
    });
    return container;
}

async function fetchData(apiUrl, dataModel, table, headers) {
    const endpoint = `${protocol}://${apiUrl}/api/datasources/${dataModel}/sql?query=select * from [${table}] limit 10000`;
    const response = await fetch(endpoint, { method: 'GET', headers });
    if (!response.ok) throw new Error('Failed to fetch data');
    return response.json();
}

async function getFlaskUrl() {
    try {
        const response = await fetch('/config.json');
        if (!response.ok) throw new Error('Failed to load config.json');

        const config = await response.json();
        return config.FLASK_API_URL; 
    } catch (error) {
        console.error('Error fetching Flask URL:', error);
        return null; 
    }
}

async function callFlaskApp(columns, rows) {
    const flaskurl = await getFlaskUrl(); 

    if (!flaskurl) {
        console.error("Flask URL not found. Check config.json.");
        return;
    }

    try {
        const response = await fetch(`${flaskurl}/run_eda`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ columns, rows })
        });

        if (!response.ok) throw new Error('Failed to call Flask app');

        return response.text();
    } catch (error) {
        console.error('Error calling Flask app:', error);
        return null;
    }
}


function createSubmitButton(callback) {
    const container = document.getElementById('buttonContainer');
    const existingButton = container.querySelector('.submit-button');
    if (existingButton) existingButton.remove();

    const button = document.createElement('button');
    button.textContent = 'SUBMIT';
    button.className = 'submit-button';
    button.addEventListener('click', callback);
    container.appendChild(button);
}

async function fetchModelsInfo(apiUrl, headers) {
    const endpoint = `${protocol}://${apiUrl}/app/explore/api/resources/notebooks/custom_code_notebooks/notebooks/automl/models/models.csv`;
    const response = await fetch(endpoint, { method: 'GET', headers });
    if (!response.ok) throw new Error('Failed to fetch models information');
    return response.json();
}

export async function addData() {

    try {
        showLoadingIndicator();

        const dataModelTableContainer = document.getElementById('dataModelTableContainer');
        const schemaContainer = document.getElementById('schemaContainer');
        const columnContainer = document.getElementById('columnContainer');
        const buttonContainer = document.getElementById('buttonContainer');
        const edaContainer = document.getElementById('edaContainer');
        const providerContainer = document.getElementById('providerContainer');
        const statusMessage = document.getElementById('statusMessage');
        const spinnerContainer = document.getElementById('spinnerContainer');
        const modelInfoTableContainer = document.getElementById('modelInfoTableContainer');
        const deploymodelContainer = document.getElementById('deploymodelContainer');
        const chatbotContainer = document.getElementById('chatbotContainer');


        dataModelTableContainer.innerHTML = '';
        schemaContainer.innerHTML = '';
        columnContainer.innerHTML = '';
        buttonContainer.innerHTML = '';
        edaContainer.innerHTML = '';
        providerContainer.style.display = 'none';
        statusMessage.innerHTML = '';
        spinnerContainer.style.display = 'none';
        modelInfoTableContainer.innerHTML = '';
        deploymodelContainer.style.display = 'none'
        chatbotContainer.style.display = 'none'

        const dataModels = await fetchDatamodels(apiUrl, headers);

        createDataTable(dataModels, 'dataModelTableContainer', 'dataModelTable', 'DATA MODELS', async (item) => {
            selectedDataModel = item.title;
            selectedDataModelId = item.oid;
            console.log(selectedDataModelId);
            const datasets = await fetchDatasets(apiUrl, item.oid, headers);

            const tables = await fetchTables(apiUrl, item.oid, datasets, headers);

            createDataTable(tables.map(table => table.name), 'schemaContainer', 'schemaTable', 'TABLES', async (table) => {
                selectedTable = table;
                const columns = showColumn(table, tables);
                createDataTable(columns, 'columnContainer', 'columnTable', 'COLUMNS: Select Target Variable', column => {
                    selectedColumn = column;
                    const categoryButtons = createCategoryButtons(category => {
                        selectedButton = category;
                        const submitCallback = async () => {
                            console.log('Selected Data Model:', selectedDataModel);
                            console.log('Selected Table:', selectedTable);
                            console.log('Selected Column:', selectedColumn);
                            console.log('Selected Button:', selectedButton);
                            console.log('Selected Schema Name:', selectedTableSchema);
                            console.log('Selected Schema Name:', selectedTableSchema.name);
                            console.log('Selected Table ID:', selectedTableSchema.oid);
                            console.log('Selected Table Columns:', selectedTableSchema.columns);
                            selectedColumnId = selectedTableSchema.columns.find(column => column.name === selectedColumn).oid;
                            console.log('Selected Column ID:', selectedColumnId);
                            dataModelTableContainer.innerHTML = '';
                            schemaContainer.innerHTML = '';
                            columnContainer.innerHTML = '';
                            buttonContainer.innerHTML = '';


                            showLoadingIndicator();
                            const edaContainer = document.getElementById('edaContainer');
                            edaContainer.style.display = 'block'; 
                            const edaRadioButton = document.querySelector('input[name="filter"][value="EDA"]');
                            if (edaRadioButton) {
                                edaRadioButton.checked = true;
                            }

                            const data = await fetchData(apiUrl, selectedDataModel, selectedTable, headers);
                            const flaskData = await callFlaskApp(data.headers, data.values);

                            const iframe = document.createElement('iframe');
                            iframe.srcdoc = flaskData;
                            edaContainer.appendChild(iframe);

                            hideLoadingIndicator();
                        };
                        createSubmitButton(submitCallback);
                    });
                    buttonContainer.appendChild(categoryButtons);
                });
            });
        });

        hideLoadingIndicator();
    } catch (error) {
        console.error('Error:', error);
        hideLoadingIndicator();
    }
}

async function eda() {
    const dataModelTableContainer = document.getElementById('dataModelTableContainer');
    const schemaContainer = document.getElementById('schemaContainer');
    const columnContainer = document.getElementById('columnContainer');
    const buttonContainer = document.getElementById('buttonContainer');
    const providerContainer = document.getElementById('providerContainer');
    const statusMessage = document.getElementById('statusMessage');
    const spinnerContainer = document.getElementById('spinnerContainer');
    const edaContainer = document.getElementById('edaContainer');
    const existingMessageDiv = document.getElementById('edaWarningId');
    const modelInfoTableContainer = document.getElementById('modelInfoTableContainer');
    const deploymodelContainer = document.getElementById('deploymodelContainer');
    
    dataModelTableContainer.innerHTML = '';
    schemaContainer.innerHTML = '';
    columnContainer.innerHTML = '';
    buttonContainer.innerHTML = '';
    providerContainer.style.display = 'none';
    statusMessage.innerHTML = '';
    spinnerContainer.style.display = 'none';
    modelInfoTableContainer.innerHTML ='';
    deploymodelContainer.style.display = 'none'
    edaContainer.style.display = ''


    const message = `Before proceeding with Exploratory Data Analysis, please ensure you've selected a table by clicking on "Add Data".`;

    if (existingMessageDiv) {
        existingMessageDiv.textContent = message;
    } else {
        const messageDiv = document.createElement('div');
        messageDiv.id = 'edaWarningId';
        messageDiv.textContent = message;
        messageDiv.classList.add('message');
        edaContainer.appendChild(messageDiv);
    }
}

//////////////////////// All providers model training Block Start ///////////////////////////////
async function modelTraining() {
    cancel = false;
    const dataModelTableContainer = document.getElementById('dataModelTableContainer');
    const schemaContainer = document.getElementById('schemaContainer');
    const columnContainer = document.getElementById('columnContainer');
    const buttonContainer = document.getElementById('buttonContainer');
    const edaContainer = document.getElementById('edaContainer');
    const statusMessage = document.getElementById('statusMessage');
    const spinnerContainer = document.getElementById('spinnerContainer');
    const modelInfoTableContainer = document.getElementById('modelInfoTableContainer');
    const deploymodelContainer = document.getElementById('deploymodelContainer');
    const chatbotContainer = document.getElementById('chatbotContainer');
    

    dataModelTableContainer.innerHTML = '';
    schemaContainer.innerHTML = '';
    columnContainer.innerHTML = '';
    buttonContainer.innerHTML = '';
    edaContainer.innerHTML = '';
    edaContainer.style.display = 'block';
    statusMessage.innerHTML = '';
    spinnerContainer.style.display = 'none';
    modelInfoTableContainer.innerHTML = ''
    deploymodelContainer.style.display = 'none'
    chatbotContainer.style.display = 'none'

    const providerContainer = document.getElementById('providerContainer');

    if (providerContainer) {
        providerContainer.style.display = 'block';
    }
}

async function checkStatus(apiUrl, headers, selectedDataModelId) {
    try {
        const statusGraphql = JSON.stringify({
            query: `
                query elasticubesMetadata($tenantFilter: String, $isViewMode: Boolean) {
                    elasticubesMetadata(tenantFilter: $tenantFilter, isViewMode: $isViewMode) {
                        oid
                        title
                        status
                        datasets {
                            oid
                            schemaName
                        }
                    }
                }
            `,
            variables: { "isViewMode": false }
        });

        const fetchStatusApi = `${protocol}://${apiUrl}/api/v2/ecm/`;
        const statusResponse = await fetch(fetchStatusApi, {
            method: 'POST',
            headers: headers,
            body: statusGraphql
        });

        if (!statusResponse.ok) {
            throw new Error('Failed to fetch status');
        }

        const statusData = await statusResponse.json();
        const elasticube = statusData.data.elasticubesMetadata.find(item => item.oid === selectedDataModelId);

        if (!elasticube) {
            throw new Error('Elasticube not found');
        }

        const { status } = elasticube;

        switch (true) {
            case status.includes("building") || (status.includes("running") && status.length > 1):
                return { running: false, message: 'Model is in the oven, baking some intelligence! Time for a snack?' };
            case status.includes("running"):
                return { running: true, message: 'Model training is completed! Ready to deploy.' };
            default:
                return { running: false, message: `Model status: ${status}` };
        }
    } catch (error) {
        console.error('Error in checkStatus:', error);
        return { running: false, message: 'Failed to check model status.' };
    }
}
let cancel = true;
async function periodicStatusCheck(apiUrl, headers, selectedDataModelId) {
    let attempt = 0;


    while (true) { 
        attempt++;
        console.log(`Periodic check attempt: ${attempt}`);

        if (cancel) {
            document.getElementById('statusMessage').innerHTML = '';
            document.getElementById('spinnerContainer').style.display = 'none';
            break;
        }

        try {
            const { running, message } = await checkStatus(apiUrl, headers, selectedDataModelId);
            console.log(`Status check completed. Is running: ${running}`);

            if (running) {
                document.getElementById('statusMessage').innerHTML = 'Model training is completed! Ready to deploy.';
                document.getElementById('spinnerContainer').style.display = 'none';
                break;
            } else {
                document.getElementById('statusMessage').innerHTML = message;
                document.getElementById('spinnerContainer').style.display = running ? 'none' : 'block';
            }
        } catch (error) {
            console.error('Error during status check:', error);
            document.getElementById('statusMessage').innerHTML = 'Failed to check model status.';
            document.getElementById('spinnerContainer').style.display = 'none';
        }

        await new Promise(resolve => setTimeout(resolve, 300000)); // 5 minutes
    }
}



const scikitLearnClick = async (event) => {

    document.getElementById('providerContainer').innerHTML = '';
    document.getElementById('statusMessage').innerHTML = 'Model is in the oven, baking some intelligence! Time for a snack?';
    document.getElementById('spinnerContainer').style.display = 'block';

    console.log(selectedDataModelId);
    console.log(selectedDataModel);
    console.log(selectedColumn);
    console.log(selectedButton);
    console.log(selectedTable);
    customCodeTableName = (selectedTable.includes('.') ? selectedTable.split('.').slice(0, -1).join('.') : selectedTable) + "_auto_sklearn_ml" + Math.floor(Math.random() * 1000);
    const graphql = JSON.stringify({
        query: "mutation addCustomCodeTable($elasticubeOid: UUID!, $table: CustomCodeTableInput!, $suggestedDatasetOid: UUID) {\n  table: addCustomCodeTable(\n    elasticubeOid: $elasticubeOid\n    table: $table\n    suggestedDatasetOid: $suggestedDatasetOid\n  ) {\n    oid\n    __typename\n  }\n}\n",
        variables: {
            "elasticubeOid": selectedDataModelId,
            "table": {
              "name": customCodeTableName,
              "oid": newGUID,
              "customCode": {
                "noteBookId": "newNotebook25",
                "language": "Python",
                "codePath": "/work/storage_notebooks/custom_code_notebooks/notebooks/newNotebook25/newNotebook25.ipynb",
                "dependsOn": [
                  {
                    "table": selectedTableSchema.name,
                    "tableOid": selectedTableSchema.oid
                  },
                  {
                    "table": selectedTableSchema.name,
                    "tableOid": selectedTableSchema.oid,
                    "column": selectedColumn,
                    "columnOid": selectedColumnId
                  }
                ],
                "mode": "Full",
                "cellsDisable": [
                  0
                ],
                "additionalParameters": {
                  "Dataset": {
                    "table": selectedTableSchema.name,
                    "tableOid": selectedTableSchema.oid
                  },
                  "Objective": selectedButton,
                  "Target Column": {
                    "table": selectedTableSchema.name,
                    "tableOid": selectedTableSchema.oid,
                    "column": selectedColumn,
                    "columnOid": selectedColumnId
                  },
                  "Drop Feature": "0"
                },
                "serverUrl": "customcode:8888",
                "timeout": 12000
              },
              "buildBehavior": {
                "type": "sync"
              },
              "columns": [
                {
                    "name": "model_name",
                    "type": 18,
                    "oid": "1fa86d63-758f-43b6-ac1b-2546faa0b7ce",
                    "indexed": false,
                    "id": "model_name"
                  },
                  {
                      "name": "metric_name",
                      "type": 18,
                      "indexed": false,
                      "id": "metric_name"
                  },
                  {
                    "name": "score",
                    "type": 18,
                    "oid": "c5f01f29-c437-42a2-8166-410552c95629",
                    "indexed": false,
                    "id": "score"
                  },
                  {
                    "name": "path",
                    "type": 18,
                    "oid": "6ad87e5f-d3a4-4db3-93d1-a6d06f846145",
                    "indexed": false,
                    "id": "path"
                  }
              ]
            }
          }
    });

    const customCodeApiEndpoint = `${protocol}://${apiUrl}/api/v2/ecm/`;

    try {
        const response = await fetch(customCodeApiEndpoint, {
            method: 'POST',
            headers: headers,
            body: graphql,
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error('Failed to add custom code table');
        }

        const buildGraphql = JSON.stringify({
            query: "mutation buildElasticube($elasticubeOid: UUID!, $buildType: ElasticubeBuildType, $buildRows: Int) {\n  buildElasticube(\n    elasticubeOid: $elasticubeOid\n    type: $buildType\n    rows: $buildRows\n  )\n}\n",
            variables: { "elasticubeOid": selectedDataModelId, "buildType": "changes" }
        });

        const buildAPIEndpoint = `${protocol}://${apiUrl}/api/v2/ecm/`;

        const buildResponse = await fetch(buildAPIEndpoint, {
            method: 'POST',
            headers: headers,
            body: buildGraphql,
            redirect: 'follow'
        });

        if (!buildResponse.ok) {
            throw new Error('Failed to start model training');
        }

        const buildResult = await buildResponse.json();
        console.log(buildResult);

        await periodicStatusCheck(apiUrl, headers, selectedDataModelId);
        
    } catch (error) {
        console.error('Error during scikitLearnClick:', error);
        document.getElementById('statusMessage').innerHTML = 'Failed to start model training.';
        document.getElementById('spinnerContainer').style.display = 'none';
    }
};

const scikitLearnImage = document.getElementById('scikit_learn');
if (scikitLearnImage) {
    scikitLearnImage.addEventListener('click', scikitLearnClick);
}

const amazonClick = async (event) => {

    document.getElementById('providerContainer').innerHTML = '';
    document.getElementById('statusMessage').innerHTML = 'Model is in the oven, baking some intelligence! Time for a snack?';
    document.getElementById('spinnerContainer').style.display = 'block';

    console.log(selectedDataModelId);
    console.log(selectedDataModel);
    console.log(selectedColumn);
    console.log(selectedButton);
    console.log(selectedTable);
    customCodeTableName = (selectedTable.includes('.') ? selectedTable.split('.').slice(0, -1).join('.') : selectedTable) + "_sagemaker_ml" + Math.floor(Math.random() * 1000);
    const graphql = JSON.stringify({
        query: "mutation addCustomCodeTable($elasticubeOid: UUID!, $table: CustomCodeTableInput!, $suggestedDatasetOid: UUID) {\n  table: addCustomCodeTable(\n    elasticubeOid: $elasticubeOid\n    table: $table\n    suggestedDatasetOid: $suggestedDatasetOid\n  ) {\n    oid\n    __typename\n  }\n}\n",
        variables: {
            "elasticubeOid": selectedDataModelId,
            "table": {
              "name": customCodeTableName,
              "oid": newGUID,
              "customCode": {
                "noteBookId": "newNotebook17",
                "language": "Python",
                "codePath": "/work/storage_notebooks/custom_code_notebooks/notebooks/newNotebook17/newNotebook17.ipynb",
                "dependsOn": [
                  {
                    "table": selectedTableSchema.name,
                    "tableOid": selectedTableSchema.oid
                  },
                  {
                    "table": selectedTableSchema.name,
                    "tableOid": selectedTableSchema.oid,
                    "column": selectedColumn,
                    "columnOid": selectedColumnId
                  }
                ],
                "mode": "Full",
                "cellsDisable": [
                  0
                ],
                "additionalParameters": {
                  "Dataset": {
                    "table": selectedTableSchema.name,
                    "tableOid": selectedTableSchema.oid
                  },
                  "Target Column": {
                    "table": selectedTableSchema.name,
                    "tableOid": selectedTableSchema.oid,
                    "column": selectedColumn,
                    "columnOid": selectedColumnId
                  },
                  "Drop Feature": "0",
                  "aws_access_key_path": '/opt/sisense/storage/notebooks/custom_code_notebooks/notebooks/aws/aws_access_key',
                  "aws_secret_access_path": '/opt/sisense/storage/notebooks/custom_code_notebooks/notebooks/aws/aws_secret_access_key',
                  "region_name": 'us-east-1',
                  "S3_bucket_name": 'sisense-autosense',
                  "aws_arn_role": 'arn:aws:iam::111213707889:role/sagemaker_auto_pilot_role'
                },
                "serverUrl": "customcode:8888",
                "timeout": 12000
              },
              "buildBehavior": {
                "type": "sync"
              },
              "columns": [      	
		        {
		            "name": "model_name",
		            "id": "model_name",
		            "type": 18
		        },
		        {
		            "name": "metric_name",
		            "id": "metric_name",
		            "type": 18
		        },
		        {
		            "name": "score",
		            "id": "score",
		            "type": 6
		        },
		        {
		            "name": "local_path",
		            "id": "local_path",
		            "type": 18
		        },
		        {
		            "name": "model_s3_location",
		            "id": "model_s3_location",
		            "type": 18
		        },
		        {
		            "name": "aws_model_name",
		            "id": "aws_model_name",
		            "type": 18
		        },
		        {
		            "name": "endpoint_name",
		            "id": "endpoint_name",
		            "type": 18
		        }
              ]
            }
          }
    });

    const customCodeApiEndpoint = `${protocol}://${apiUrl}/api/v2/ecm/`;

    try {
        // Send request to add custom code table
        const response = await fetch(customCodeApiEndpoint, {
            method: 'POST',
            headers: headers,
            body: graphql,
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error('Failed to add custom code table');
        }

        // Success handling for adding custom code table
        const buildGraphql = JSON.stringify({
            query: "mutation buildElasticube($elasticubeOid: UUID!, $buildType: ElasticubeBuildType, $buildRows: Int) {\n  buildElasticube(\n    elasticubeOid: $elasticubeOid\n    type: $buildType\n    rows: $buildRows\n  )\n}\n",
            variables: { "elasticubeOid": selectedDataModelId, "buildType": "changes" }
        });

        const buildAPIEndpoint = `${protocol}://${apiUrl}/api/v2/ecm/`;

        // Send request to build elasticube
        const buildResponse = await fetch(buildAPIEndpoint, {
            method: 'POST',
            headers: headers,
            body: buildGraphql,
            redirect: 'follow'
        });

        if (!buildResponse.ok) {
            throw new Error('Failed to start model training');
        }

        // Success handling for build elasticube
        const buildResult = await buildResponse.json();
        console.log(buildResult);

        // Start periodic status check
        await periodicStatusCheck(apiUrl, headers, selectedDataModelId);
        
    } catch (error) {
        console.error('Error during amazonClick:', error);
        document.getElementById('statusMessage').innerHTML = 'Failed to start model training.';
        document.getElementById('spinnerContainer').style.display = 'none';
    }
};

// Add event listener
const amazonImage = document.getElementById('amazon');
if (amazonImage) {
    amazonImage.addEventListener('click', amazonClick);
}

//////////////////////// All providers model training Block End ///////////////////////////////
async function downloadModel() {
    cancel = true;
    const dataModelTableContainer = document.getElementById('dataModelTableContainer');
    const schemaContainer = document.getElementById('schemaContainer');
    const columnContainer = document.getElementById('columnContainer');
    const buttonContainer = document.getElementById('buttonContainer');
    const edaContainer = document.getElementById('edaContainer');
    const statusMessage = document.getElementById('statusMessage');
    const spinnerContainer = document.getElementById('spinnerContainer');
    const providerContainer = document.getElementById('providerContainer');
    const modelInfoTableContainer = document.getElementById('modelInfoTableContainer');
    const deploymodelContainer = document.getElementById('deploymodelContainer');
    const chatbotContainer = document.getElementById('chatbotContainer');

    dataModelTableContainer.innerHTML = '';
    schemaContainer.innerHTML = '';
    columnContainer.innerHTML = '';
    buttonContainer.innerHTML = '';
    edaContainer.innerHTML = '';
    statusMessage.innerHTML = '';
    spinnerContainer.style.display = 'none';
    providerContainer.style.display = 'none';
    modelInfoTableContainer.style.display = '';
    modelInfoTableContainer.innerHTML = '';
    edaContainer.style.display = 'block';
    deploymodelContainer.style.display = 'none';
    chatbotContainer.style.display = 'none';

    const ml_data = await fetchModelsInfo(apiUrl, headers);

    const csvString = ml_data.content;

    // Function to parse the CSV string into an array of objects
    function parseCSV(csv) {
        const lines = csv.split('\n').filter(line => line.trim() !== ''); // Filter out empty lines
        const headers = lines[0].split(',');

        return lines.slice(1).map(line => {
            const values = line.split(',');
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = values[index];
            });
            return obj;
        });
    }

    function capitalizeHeaders(headers) {
        return headers.map(header => header.toUpperCase());
    }

    function generateTable(data) {
        if (!data.length) return '';

        const headers = Object.keys(data[0]);
        const table = document.createElement('table');
        table.id = 'modelInfoTable'; 

        // Generate the table header
        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header.toUpperCase(); 
            headerRow.appendChild(th);
        });

        // Generate the table body
        const tbody = table.createTBody();
        data.forEach(row => {
            const tableRow = tbody.insertRow();
            headers.forEach(header => {
                const cell = tableRow.insertCell();
                if (header === 'path') {
                    const link = document.createElement('a');
                    link.href = row[header].replace('/opt/sisense/storage', `${protocol}://${apiUrl}/app/explore/files`);
                    const displayPath = row[header].replace('/opt/sisense/storage/notebooks/custom_code_notebooks/notebooks/', '');
                    link.textContent = displayPath;
                    link.target = '_blank'; 
                    cell.appendChild(link);
                } else if (header === 'widget_id') {
                    const link = document.createElement('a');
                    link.href = '#'; 
                    link.textContent = row[header];
                    link.style.textDecoration = 'underline';
                    link.style.cursor = 'pointer';
                    link.addEventListener('click', async (event) => {
                        event.preventDefault();
                        console.log('widget_id:', row['widget_id']);
                        console.log('dash_id:', row['dash_id']);
                        document.querySelector('input[name="filter"][value="Deploy Model"]').checked = true; 
                        await deployModel(row['dash_id'], row['widget_id']); 
                    });
                    cell.appendChild(link);
                } else {
                    cell.textContent = row[header];
                }
            });
        });

        return table;
    }

    // Parse the CSV string
    const data = parseCSV(csvString);

    // Generate the table and insert it into the DOM
    const tableContainer = document.getElementById('modelInfoTableContainer');
    const table = generateTable(data);
    tableContainer.appendChild(table);
}


async function deployModel(dashId, widgetId) {
    cancel = true;
    const dataModelTableContainer = document.getElementById('dataModelTableContainer');
    const schemaContainer = document.getElementById('schemaContainer');
    const columnContainer = document.getElementById('columnContainer');
    const buttonContainer = document.getElementById('buttonContainer');
    const edaContainer = document.getElementById('edaContainer');
    const statusMessage = document.getElementById('statusMessage');
    const spinnerContainer = document.getElementById('spinnerContainer');
    const providerContainer = document.getElementById('providerContainer');
    const modelInfoTableContainer = document.getElementById('modelInfoTableContainer');
    const deploymodelContainer = document.getElementById('deploymodelContainer');

    dataModelTableContainer.innerHTML = '';
    schemaContainer.innerHTML = '';
    columnContainer.innerHTML = '';
    buttonContainer.innerHTML = '';
    edaContainer.innerHTML = '';
    statusMessage.innerHTML = '';
    spinnerContainer.style.display = 'none';
    providerContainer.style.display = 'none';
    modelInfoTableContainer.innerHTML = '';
    modelInfoTableContainer.style.display = 'none';
    deploymodelContainer.style.display = 'block';

    // Adding the iframe to the deploymodelContainer with dynamic dashId and widgetId
    deploymodelContainer.innerHTML = `
        <iframe width="100%" height="100%" frameborder="0" src="${protocol}://${apiUrl}/app/main/dashboards/${dashId}?embed=true&r=false"></iframe>
    `;
}

async function chatBot() {
    cancel = true;
    const dataModelTableContainer = document.getElementById('dataModelTableContainer');
    const schemaContainer = document.getElementById('schemaContainer');
    const columnContainer = document.getElementById('columnContainer');
    const buttonContainer = document.getElementById('buttonContainer');
    const edaContainer = document.getElementById('edaContainer');
    const statusMessage = document.getElementById('statusMessage');
    const spinnerContainer = document.getElementById('spinnerContainer');
    const providerContainer = document.getElementById('providerContainer');
    const modelInfoTableContainer = document.getElementById('modelInfoTableContainer');
    const deploymodelContainer = document.getElementById('deploymodelContainer');
    const chatbotContainer = document.getElementById('chatbotContainer');

    dataModelTableContainer.innerHTML = '';
    schemaContainer.innerHTML = '';
    columnContainer.innerHTML = '';
    buttonContainer.innerHTML = '';
    edaContainer.innerHTML = '';
    statusMessage.innerHTML = '';
    edaContainer.style.display = 'block';
    spinnerContainer.style.display = 'none';
    providerContainer.style.display = 'none';
    modelInfoTableContainer.innerHTML = '';
    modelInfoTableContainer.style.display = 'none';
    deploymodelContainer.style.display = 'none';
    chatbotContainer.style.display = 'block';

    // Only if you are using Chatbot( for now need to hardcode domian name and dashbaord id)
    chatbotContainer.innerHTML = `
        <iframe width="100%" height="100%" frameborder="0" src="${protocol}://<your_IP-or-Domain>/app/main/dashboards/<dash_id>?embed=true&r=false"></iframe>
    `;
}

window.addData = addData;
window.eda = eda;
window.modelTraining = modelTraining;
window.downloadModel = downloadModel;
window.deployModel = deployModel;
window.chatBot = chatBot;