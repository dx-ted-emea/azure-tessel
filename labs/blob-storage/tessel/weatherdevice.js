// The MIT License (MIT)

// Copyright (c) 2014 Microsoft DX TED EMEA

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

console.log();
console.log('Sample weather deviceId');
console.log('-----------------------');
console.log();
console.log('  Press config button on Tessel to upload data to Azure Blob Storage');
console.log();
console.log('  Have you remembered to replace the Signed Access Signature and accountName in the code?');
console.log();

// UPDATE THE BELOW SIGNED ACCESS SIGNATURE, SAS
// Use Azure-CLI to get this SAS
//
// > azure storage container sas create weatherlogs w 2014-11-11
//
// Replace the above date with tomorrows date. Have a look at the lab
// "Uploading structured data to Azure Table Storage" that automates the process
// of retrieving configuration and SAS from a service.

// TODO: REPLACE US!!!!!!!!
var sas = 'se=2014-11-11T00%3A00%3A00Z&sp=w&sv=2014-02-14&sr=c&sig=RqZeSVZ5GMs%2B1gCilSkFqK8FnLGKuSQWwPvcumLDYEg%3D'; 
var	accountName = 'tesselazure';

var tessel = require('tessel');
var https = require('https');

var delay = 1000; //ms
var buffer = '';

var measureInterval = setInterval(measure, delay);

tessel.button.on('press', upload);

function upload() {
	// Temporary suspend measurement
	clearInterval(measureInterval);

	var blobContainer = 'weatherlogs';

	// Create a unique name for the blob using Tessel's serial number and current date
	var blobName = (new tessel.deviceId() + '|' + new Date().toISOString()).replace(/[-|:.]/g, '') + '.log';

	var	content = buffer;
	buffer = '';

	contentType = 'text/plain';

	console.log('\nINFO Uploading blob to https://' + 
		accountName + '.blob.core.windows.net/' + 
		blobContainer + '/' + blobName);

	uploadBlockBlob(accountName, blobContainer, blobName, sas, content, contentType, function(error, result) {
		if (!error) {
			console.log('INFO Done!\n');

			// Resume measurements since upload went well
			measureInterval = setInterval(measure, delay);
		} else {
			console.error('ERROR Unable to upload blob');
			console.error(error);
		}
	});
}

function uploadBlockBlob(accountName, blobContainer, blobName, sas, content, contentType, callback) {
	// Uploads a new block blob to azure storage and uses Shared Access Signature, SAS, for authenication.

  	var options = {
	    hostname: accountName + '.blob.core.windows.net',
	    port: 443,
	    path: '/' + blobContainer + '/' + blobName + '?' + sas,
	    method: 'PUT',
	    headers: {
	      	'Content-Length' : content.length,
	      	'Content-Type' : contentType,
	      	'x-ms-blob-type' : 'BlockBlob',

	      	'Accept' : 'application/json'
	    }
  	};

	var req = https.request(options, function(res) {
		var body = '';

		console.log('INFO HTTP StatusCode:', res.statusCode);

		res.on('data', function(data) {
			body += data;
		});

		res.on('end', function() {
			callback(null, body);
		});
	});

	req.on('error', function(error) {
		callback(error, null);
	});

	req.write(content);
	req.end();
}

function measure() {
	var date = new Date().toISOString();
	var deviceId = tessel.deviceId();
	var temperature = getTemperature();
	var humidity = getHumidity();

	var measurement =
		date + ';' +
		padLeft(temperature, 3, ' ') + ';' +
		padLeft(humidity, 3, ' ');

	console.log(measurement);

	buffer += measurement + '\n';
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

