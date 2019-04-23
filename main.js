window.THREE = require('three');
window.DEBUG = true;

const ClientGame = require("./client/clientgame");
const GameplayScene = require("./client/gameplayscene");
const io = require("socket.io-client");

const Test = require("./client/views/test.svelte");

window.onload = () => {
  const socket = io();
  const client = new ClientGame();
  client.start();

  client.setScene(new GameplayScene(socket));

  new Test({
    target: document.body
  });
};