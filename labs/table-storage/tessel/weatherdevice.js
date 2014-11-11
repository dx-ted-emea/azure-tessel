console.log();
console.log('INFO Requiring packages');

var tessel = require('tessel');
var https = require('https');

// REPLACE yournamegoeshere WITH THE NAME OF YOUR AZURE MOBILE SERVICE
// WARNING: THIS IS NOT NECESSARY THE SAME NAME AS YOUR STORAGE ACCOUNT

var apiUrl = "https://yournamegoeshere.azure-mobile.net/api/weatherconfig";

var apiCallLed = 0;
var measureLed = 1;

var minRetryDelay = 3000;
var maxRetryDelay = 15000;

var tableName = 'weatherlogs';

var config;
var measurementsSinceConfReftesh = 0;

// Start update loop to get connection information
console.log('INFO Starting measurement loop\n');
setImmediate(getConfig);

function getConfig() {
	measurementsSinceConfReftesh = 0;

	setLed(apiCallLed, true);
	console.log('INFO Retrieving configuration...');

	var url = apiUrl + '?deviceId=' + tessel.deviceId();

	httpGetJSON(url, function(err, result) {
		if (!err && result.authorized) {
			config = result;

			console.log(config);
			console.log('INFO ... retrieved!\n');

			setImmediate(measure);

		} else {
			var delay = getRandomRetryDelay();

			console.error('ERROR Unable to get configuration. Trying again in', delay, 'ms');
			if (result && result.message)
				console.error(result.message);
			else
				console.error(err);

			setTimeout(getConfig, delay);
		}

		setLed(apiCallLed, false);
	});
}

function measure() {
	measurementsSinceConfReftesh++;
	if (measurementsSinceConfReftesh > config.refreshConfigAfterNo)	{
		// If it's time to get a new config, let's do it emmediately
		setImmediate(getConfig);
	} else {

		setLed(measureLed, true);
		console.log('INFO Measuring [' + measurementsSinceConfReftesh + '] ...');	

		var deviceId = tessel.deviceId();
		var weatherLog = getFakeWeaterLog(deviceId);
		// console.log(weatherLog);

		console.log('INFO ... measured!');

		// Upload weather log to Azure Table
		console.log('INFO Sending...')

		insertTableEntity(config.azureStorageAccount, config.tableName, config.sas, weatherLog, function (error, result) {
			if (!error) {
				console.log('INFO ... sent!\n');
			} else {
				var delay = getRandomRetryDelay();

				console.error('ERROR unable to insert data in Azure Table Storage. Trying again in', delay, 'ms');
				console.error(error);

				setTimeout(measure, delay);
			}

			console.log('INFO Delaying [' + config.delayBetweenMeasurements + 'ms]\n');
			setTimeout(measure, config.delayBetweenMeasurements);
			setLed(measureLed, false);
		});
	}
}

function insertTableEntity(accountName, tableName, sas, entity, callback) {
	// Inserts a new row in azure table and uses Shared Access Signature, SAS, for authenication.
	// In order to succeed with the authentication the SAS need to include the permission "a" = add.
	// The parameter entity needs to express one row in an Azure Table and by such it need to contain
	// parameters for: PartitionKey and RowKey among the other parameters.

	var jsonEntity = JSON.stringify(entity);

  	var options = {
	    hostname: accountName + '.table.core.windows.net',
	    port: 443,
	    path: '/' + tableName + '/?' + sas,
	    method: 'POST',
	    headers: {
	      	'Content-Length' : jsonEntity.length,
	      	'Content-Type' : 'application/json',
	      	'Accept' : 'application/json;odata=nometadata'
	    }
  	};

	var req = https.request(options, function(res) {
		var body = '';

		res.on('data', function(data) {
			body += data;
		});

		res.on('end', function() {
			callback(null, JSON.parse(body));
		});
	});

	req.on('error', function(error) {
		callback(error, null);
	});

	req.write(jsonEntity);
	req.end();
}

function httpGetJSON(url, callback) {
	https.get(url, function(res) {
		var body = '';

		res.on('data', function(data) {
			body += data;
		});

		res.on('end', function() {
			callback(null, JSON.parse(body));
		});

	}).on('error', function (error) {
		callback(error, null);
	});
}

function setLed(ledNo, val) {
	var led = tessel.led[ledNo].output(0);
	led.write(val);
}

function getRandomRetryDelay() {
	return Math.floor(Math.random() * (maxRetryDelay - minRetryDelay + 1) + minRetryDelay);
}

function getFakeWeaterLog(deviceId) {

	var date = new Date();

	var partitionKey = getPartitionKey(deviceId, date);
	var rowKey = getRowKey(date);
	var temperature = getTemperature();
	var humidity = getHumidity();

	var weatherLog = {
		PartitionKey: partitionKey,
		RowKey: rowKey,
		Temperature: temperature,
		Humidity: humidity
	};

	return weatherLog;
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
