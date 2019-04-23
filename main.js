window.THREE = require('three');
window.DEBUG = true;

const ClientGame = require("./client/clientgame");
const GameplayScene = require("./client/gameplayscene");
const io = require("socket.io-client");

const Test = require("./client/views/main.svelte");

window.onload = () => {
  const socket = io();

  const renderTarget = new Test({
    target: document.body
  });

  const client = new ClientGame();
  client.start(renderTarget.$$.ctx.rendertarget);

  client.setScene(new GameplayScene(socket));

};