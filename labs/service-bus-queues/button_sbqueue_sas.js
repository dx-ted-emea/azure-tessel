// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

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


