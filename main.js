window.THREE = require('three');
window.DEBUG = true;

const ClientGame = require("./client/clientgame");
const GameplayScene = require("./client/gameplayscene");
const io = require("socket.io-client");

import Test from "./client/views/test.svelte";

window.onload = () => {
  /* var socket = io();
   const client = new ClientGame();
   client.start();

   client.setScene(new GameplayScene(socket));*/

  new Test({
    target: document.body
  });
};