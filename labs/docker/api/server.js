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

// Simple HTTP Server implementation that responds back with a
// JSON Object containing a random number whenever invoked

var http = require('http')
var port = process.env.PORT || 1337;

http.createServer(function(request, response) {

  var rnd = randomIntInc(1, 6);
  var body = { rnd: rnd }
  console.log('Random service invoked. Rnd #: ' + rnd); // Log request for visibility

  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));

}).listen(port);

// Simple method that simulates a dice and returns a number
// from and including low, to and including high.
function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}