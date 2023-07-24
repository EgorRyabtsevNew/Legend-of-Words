const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname + '/public'));

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

  socket.on('updatePosition', (data) => {
    const tileSize = 50;
    const roundedX = Math.floor(data.x / tileSize) * tileSize;
    const roundedY = Math.floor(data.y / tileSize) * tileSize;
    players[socket.id].x = roundedX;
    players[socket.id].y = roundedY;
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

server.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
