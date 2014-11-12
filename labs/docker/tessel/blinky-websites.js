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

var tessel = require('tessel');
var http = require('http');

// Replace the [websitename] with the name of the website
// your are connecting to.
var apiUrl = "https://[websitename].azurewebsites.net";

console.log();
console.log('blinky-websites');
console.log('----------------------');
console.log('check: your tessel should be connected to wifi (orange led)');
console.log('check: make sure you have changed the url to your service');
console.log('using: ', apiUrl);
console.log();
console.log('press the config-button on your tessel to invoke service call');

tessel.button.on('press', function(time) {
	console.log('main - button pressed');

	httpGetJSON(apiUrl, function(err, obj) {
		if (!err) {
			console.log('main - received random number:', obj.rnd);
			console.log('main - flashing led %d times', obj.rnd);

			blink(1, obj.rnd, function() {
				console.log('main - done');
				console.log();
			});
		}
		else {
			console.error('error -', err.message);
		}
	});
});

function httpGetJSON(url, callback) {
	http.get(url, function(res) {
		var body = '';

		res.on('data', function(data) {
			console.log('httpGetJSON - data received', data);
			body += data;
		});

		res.on('end', function() {
			console.log('httpGetJSON - all data received', body);
			callback(null, JSON.parse(body));
		});

	}).on('error', function (err) {
		// An error occurred while calling url
		callback(err, null);
	});
}

function blink(ledNo, noTimes, callback) {
	if (noTimes > 0) {
		var led = tessel.led[ledNo].output(0);
		var lightOnDelay = 500;
		var lightOffDelay = 1000;

		console.log('blink - turning on led (%d)', noTimes);
		led.write(true);
		setTimeout(function(){
			console.log('blink - turning off led');
			led.write(false);
			setTimeout(blink, lightOffDelay, ledNo, noTimes - 1, callback);
		}, lightOnDelay);	
	}
	else {
		callback();
	}
}