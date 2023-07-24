const socket = io();

const stage = new Konva.Stage({
  container: 'container',
  width: window.innerWidth,
  height: window.innerHeight
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
  const tileSize = 50; 
  const pos = stage.getPointerPosition();
  const roundedX = Math.floor(pos.x / tileSize) * tileSize;
  const roundedY = Math.floor(pos.y / tileSize) * tileSize;
  socket.emit('updatePosition', { x: roundedX, y: roundedY });
});
