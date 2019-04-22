const ClientGame = require("./client/clientgame");
const GameplayScene = require("./client/gameplayscene");
const io = require("socket.io-client");
window.THREE = require('three');
window.DEBUG = true;
window.onload = () => {


  var socket = io();
  /* socket.on('init', function (data) {
    console.log(data);
  });
*/
  const client = new ClientGame();
  client.start();

  client.setScene(new GameplayScene(socket));
};