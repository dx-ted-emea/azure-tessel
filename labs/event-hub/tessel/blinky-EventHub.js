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

var https = require('https');
var crypto = require('crypto');

// Event Hubs parameters
console.log('----------------------------------------------------------------------');
console.log('Please ensure that you have modified the values for: namespace, hubname, partitionKey, eventHubAccessKeyName');
console.log('Please ensure that you have created a Shared Access Signature Token and you are using it in the code')
console.log('----------------------------------------------------------------------');
console.log(''); 

var namespace = 'YourNameSpaceHere';
var hubname ='YourHubNameHere';
var partitionKey = 'mytessel';
var eventHubAccessKeyName = 'YourEventHubKeyNameHere';
var createdSAS = 'YourSharedAccessKeyTokenHere';

console.log('Namespace: ' + namespace);
console.log('hubname: ' + hubname);
console.log('partitionKey: ' + partitionKey);
console.log('eventHubAccessKeyName: ' + eventHubAccessKeyName);
console.log('SAS Token: ' + createdSAS);
console.log('----------------------------------------------------------------------');
console.log('');
 
// Payload to send
var payload = '{\"Temperature\":\"37.0\",\"Humidity\":\"0.4\"}';

 
// Send the request to the Event Hub
var options = {
  hostname: namespace + '.servicebus.windows.net',
  port: 443,
  path: '/' + hubname + '/publishers/' + partitionKey + '/messages',
  method: 'POST',
  headers: {
    'Authorization': createdSAS,
    'Content-Length': payload.length,
    'Content-Type': 'application/atom+xml;type=entry;charset=utf-8'
  }
};

var req = https.request(options, function(res) {
  console.log('----------------------------------------------------------------------');
  console.log("statusCode: ", res.statusCode);
  console.log('----------------------------------------------------------------------');
  console.log('');
  res.on('data', function(d) {
    process.stdout.write(d);
  });
});
 
req.on('error', function(e) {
  console.log('error');
  console.error(e);
});
 
req.write(payload);
req.end();
