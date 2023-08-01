const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const config = require('./config');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));

const players = {};

io.on('connection', (socket) => {
  socket.on('newPlayer', (nickname) => {
    players[socket.id] = {
      nickname: nickname,
      x: Math.floor(Math.random() * 500),
      y: Math.floor(Math.random() * 500),
      color: getRandomColor(),
    };
    io.emit('allPlayers', players);
  });

  socket.on('move', (data) => {
    players[socket.id].x = data.x;
    players[socket.id].y = data.y;
    io.emit('allPlayers', players);
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('allPlayers', players);
  });
});

function getRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

server.listen(config.port, () => {
  console.log(`Server started idk try it`);
});
