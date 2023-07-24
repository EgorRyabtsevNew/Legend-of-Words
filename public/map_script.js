const socket = io();

const stage = new Konva.Stage({
  container: 'container',
  width: 500,
  height: 500
});

const layer = new Konva.Layer();
stage.add(layer);

let players = {};

const urlParams = new URLSearchParams(window.location.search);
const nickname = urlParams.get('nickname');
if (nickname) {
  socket.emit('newPlayer', nickname);
}

socket.on('allPlayers', (data) => {
  players = data;
  updatePlayers();
});

function updatePlayers() {
  layer.destroyChildren();

  Object.keys(players).forEach((playerId) => {
    const player = players[playerId];

    const circle = new Konva.Circle({
      x: player.x,
      y: player.y,
      radius: 10,
      fill: player.color,
    });

    layer.add(circle);
  });

  layer.draw();
}

stage.on('click', (e) => {
  const pos = stage.getPointerPosition();
  socket.emit('updatePosition', { x: pos.x, y: pos.y });
});
