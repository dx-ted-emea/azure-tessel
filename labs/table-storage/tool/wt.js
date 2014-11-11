var azure = require('azure-storage');

var validCommands = ['create', 'insert', 'read', 'clear', 'delete'];

var command;

// Get command to execute
if (process.argv[2] && 
	validCommands.indexOf(process.argv[2].toLowerCase()) >= 0) {
	command = process.argv[2].toLowerCase();
}

// If a storage account is passed in as a parameter, temporary set the environment variable to use that
if (process.argv[3]) {
	process.env.AZURE_STORAGE_ACCOUNT = process.argv[3];
} 

// If a storage access key is passed in as a parameter, temporary set the environment variable to use that
if (process.argv[4]) {
	process.env.AZURE_STORAGE_ACCESS_KEY = process.argv[4];
} 

if (command && process.env.AZURE_STORAGE_ACCOUNT && process.env.AZURE_STORAGE_ACCESS_KEY) {
	if (command == 'create') createTable();
	if (command == 'insert') insertData();
	if (command == 'read') readData();
	if (command == 'clear') deleteData();
	if (command == 'delete') deleteTable();
}
else {
	// Incorrect or to little input parameters, show usage screen

	if (!process.env.AZURE_STORAGE_ACCOUNT) {
		process.env.AZURE_STORAGE_ACCOUNT = "(not currently set)";
	}

	if (!process.env.AZURE_STORAGE_ACCESS_KEY) {
		process.env.AZURE_STORAGE_ACCESS_KEY = "(not currently set)";
	}

	console.log();
	console.log('Weather Tool, WT');
	console.log('  for lab: UPLOADING STRUCTURED DATA TO AZURE TABLE STORAGE');
	console.log();
	console.log('usage: node tst <create | insert | read | clear | delete> [azureStorageAccount] [azureStorageAccessKey]')
	console.log();
	console.log('Azure storage access need to be provided as parameters or through the following environment');
	console.log('variables. Look-up how you set Environment Variables for your operating system or pass in');
	console.log('the credentials as parameters');
	console.log();
	console.log('Currently using:');
	console.log('  AZURE_STORAGE_ACCOUNT    :', process.env.AZURE_STORAGE_ACCOUNT);
	console.log('  AZURE_STORAGE_ACCESS_KEY :', process.env.AZURE_STORAGE_ACCESS_KEY);
	console.log();
}

function createTable() {
	console.log();
	console.log('Setting up table in Azure Tables');
	console.log();

	
	// Create a table service client. If not provided, the SDK will use storage account name and key
	// stored in the environment variables AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY.
	var tableService = azure.createTableService();
	tableService.createTableIfNotExists('weatherlogs', function(error, result, response){
	  if(!error){
	    // result contains true if created; false if already exists

	    if (result){
	    	console.log('- table weatherlogs created');
	    } else {
	    	console.log('- table weatherlogs already exists');
	    }
	  } else {
	  	// An error occured

	  	console.log("Unable to create table");
	  	console.log(error);

	  }

	  console.log();
	});
}

function insertData() {
	console.log();
	console.log('Insert sample data in table');
	console.log();

	var tableService = azure.createTableService();

	var deviceId = 'TM-00-04-f000da30-0061473d-36582586';

	var entGen = azure.TableUtilities.entityGenerator;

	var date = new Date();

	var partitionKey = getPartitionKey(deviceId, date);
	var rowKey = getRowKey(date);

	// Generate random sample values for temperature and humidity
	var temperature = getTemperature();
	var humidity = getHumidity();

	console.log('PartitionKey      : ', partitionKey);
	console.log('RowKey            : ', rowKey);
	console.log('Temperature       : ', temperature);
	console.log('Humidity          : ', humidity);

	var weatherLog = {
		PartitionKey: entGen.String(partitionKey),
		RowKey: entGen.String(rowKey),
		Temperature: entGen.Int32(temperature),
		Humidity: entGen.Int32(humidity)
	};

	tableService.insertEntity('weatherlogs', weatherLog, function (error, result, response) {
	  if(!error){
	    // result contains the ETag for the new entity

	    console.log('Sample Weather Log inserted successfully in table weatherlogs');

	  } else {
	  	// An error occured

	  	console.log("Unable to insert data");
	  	console.log(error);

	  }

	  console.log();
	});
}

function readData() {
	console.log();
	console.log('Reading top 50 rows from table');
	console.log();

	var tableService = azure.createTableService();
	var query = new azure.TableQuery().top(50);

	// console.log(tableService.queryEntities.toString());
	tableService.queryEntities('weatherlogs', query, null, function(error, result, response) {
		if (!error) {
			if (result.entries.length == 0)
			{
				console.log('Table weatherlogs does not contain any entries');
			} else {
				console.log('PartitionKey\t\t\t\t\tRowKey\tTemperature\tHumidity');
				console.log();

				result.entries.forEach(function (value, index, arr) {

					console.log(value.PartitionKey._ + '\t' + value.RowKey._ + '\t' + 
						value.Temperature._ + '\t\t' + value.Humidity._);
				});
			}
		} else {
	  	// An error occured

	  	console.log('Unable to read data');
	  	console.log(error);

	  }

	  console.log();
	});
}

function deleteData() {
	// TODO - Replace current implementation with more efficient batch delete API call
	
	var entGen = azure.TableUtilities.entityGenerator;
	var tableService = azure.createTableService();

	var query = new azure.TableQuery().top(1);

	tableService.queryEntities('weatherlogs', query, null, function (error, result, response) {
		if (!error) {
			if (result.entries.length > 0) {
				var weatherLog = {
					PartitionKey: entGen.String(result.entries[0].PartitionKey._),
					RowKey: entGen.String(result.entries[0].RowKey._)
				};

				tableService.deleteEntity('weatherlogs', weatherLog, function (err, resp) {
					if (!err) {
						process.stdout.write('.'); // show progress
						setImmediate(deleteData);
					} else {
						console.log('Unable to delete row');
						console.log(error);
					}

				});
			} else {
				console.log('\n\nTable is empty!');
			}
		} else {
			console.log('Unable to delete rows');
			console.log(error);
		}
	});
}

function deleteTable() {
	console.log();
	console.log('Deleting data and table');
	console.log();
	
	// Create a table service client. If not provided, the SDK will use storage account name and key
	// stored in the environment variables AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY.
	var tableService = azure.createTableService();
	tableService.deleteTable('weatherlogs', function(error, response){
	  if(!error){

	    	console.log('- table weatherlogs deleted');

	  } else {
	  	// An error occured

	  	console.log("Unable to delete table");
	  	console.log(error);

	  }

	  console.log();
	});
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}



function getPartitionKey(deviceId, date) {
	// Generate a partition key that gives each device a
	// unique partition for each (month and) day

	var partitionKey =
			deviceId + '|' +
			date.getFullYear() +
			padLeft(date.getMonth() + 1, 2) +
			padLeft(date.getDate(), 2);

	return partitionKey;
}

function getRowKey(date) {
	// Generate a row key that sort the rows descending by
	// calculating number of seconds left on current day

	var secondsSinceMidnight = 
		date.getHours() * 3600 +
		date.getMinutes() * 60 +
		date.getSeconds();

	var secondsPerDay = 24*60*60; // 24h x 60 min x 60 sec = 86400
	var secondsLeftToday = secondsPerDay - secondsSinceMidnight;
	var rowKey = padLeft(secondsLeftToday, 5);

	return rowKey;
}

function getTemperature() {
	// Fake implementation. Just returns a random number
	var temperature = Math.floor((Math.random() * 100) - 50);

	return temperature;
}

function getHumidity() {
	// Fake implementation. Just returns a random number
	var humidity = Math.floor((Math.random() * 100) + 1);

	return humidity;
}

function padLeft(i, n, str){
    return Array(n - String(i).length + 1).join(str||'0') + i;
}