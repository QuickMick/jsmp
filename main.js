const io = require("socket.io-client");

var socket = io();
socket.on('init', function (data) {
  console.log(data);
});