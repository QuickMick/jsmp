// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

const GameController = require("./server/gamecontroller");

app.set('port', 5000);
app.use('/', express.static(__dirname + '/public'));

// Routing
app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, 'public/index.html'));
});

// Starts the server.
server.listen(5000, function () {
  console.log('Starting server on port 5000');
});

new GameController(io);