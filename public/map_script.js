const socket = io();

const stage = new Konva.Stage({
  container: 'container',
  width: window.innerWidth,
  height: window.innerHeight,
});

const layer = new Konva.Layer();
stage.add(layer);

let players = {};

const tileSize = 50;

const urlParams = new URLSearchParams(window.location.search);
const nickname = urlParams.get('nickname');
if (nickname) {
  socket.emit('newPlayer', nickname);
}

socket.on('allPlayers', (data) => {
  players = data;
  updatePlayers();
});

function drawTileBorders() {
  const lineAttrs = {
    stroke: 'black',
    strokeWidth: 1,
  };

  for (let x = tileSize; x < window.innerWidth; x += tileSize) {
    const line = new Konva.Line({
      points: [x, 0, x, window.innerHeight],
      ...lineAttrs,
    });
    layer.add(line);
  }

  for (let y = tileSize; y < window.innerHeight; y += tileSize) {
    const line = new Konva.Line({
      points: [0, y, window.innerWidth, y],
      ...lineAttrs,
    });
    layer.add(line);
  }
}

function updatePlayers() {
  layer.destroyChildren();
  drawTileBorders();

  Object.keys(players).forEach((playerId) => {
    const player = players[playerId];

    const x = Math.min((Math.floor(player.x / tileSize) + 0.5) * tileSize, window.innerWidth - 20);
    const y = Math.min((Math.floor(player.y / tileSize) + 0.5) * tileSize, window.innerHeight - 20);

    const circle = new Konva.Circle({
      x,
      y,
      radius: 10,
      fill: player.color,
    });

    layer.add(circle);
  });

  layer.draw();
}

stage.on('click', (e) => {
  const pos = stage.getPointerPosition();
  const roundedX = Math.floor(pos.x / tileSize) * tileSize;
  const roundedY = Math.floor(pos.y / tileSize) * tileSize;
  socket.emit('updatePosition', { x: roundedX, y: roundedY });
});
