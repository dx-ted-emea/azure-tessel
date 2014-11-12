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


/*********************************************
This ambient module example console.logs
ambient light and sound levels and whenever a
specified light or sound level trigger is met.
*********************************************/

// Service Bus Parameters
var namespace = '<your-servicebus-namespace>';
var queue = '<your-queue-name>';
var Key = '<your-SAS-key>';


var tessel = require('tessel');
var ambientlib = require('ambient-attx4');
var https = require('https');

var delay = 1000; //ms
var buffer = '';

var measureInterval = setInterval(measure, delay);

tessel.button.on('press', putMessageInQueue);



function putMessageInQueue() {

	
    var options = {
        hostname: namespace + '.' + 'servicebus.Windows.net',
        port: 443,
        path: '/' + queue + '/messages',
        method: 'POST',
        headers: {
            'Authorization': Key,
            'Content-Type': 'application/atom+xml;type=entry;charset=utf-8',
        }
    };

    var req = https.request(options, function (res) {
        console.log("putMessageInQueue:statusCode: ", res.statusCode);

		res.setEncoding('utf8');
        res.on('data', function (d) {
            
        });
    });

    req.on('error', function (e) {
        console.error(e);
    });
	
	var message = 'button pressed on tessel';
	
    req.write(message);

    req.end();


}


