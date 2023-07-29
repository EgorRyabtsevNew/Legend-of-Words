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
const mapWidthInTiles = 50;
const mapHeightInTiles = 50;
const borderWidth = 5;
const mapWidth = mapWidthInTiles * tileSize;
const mapHeight = mapHeightInTiles * tileSize;
const mapBorderWidth = borderWidth / 2;
const mapBorderColor = 'black';

const totalMapWidth = mapWidth + window.innerWidth;
const totalMapHeight = mapHeight + window.innerHeight;

let isDragging = false;
let lastPointerPosition;

stage.on('mousedown', (e) => {
  if (e.evt.button === 0) {
    isDragging = true;
    lastPointerPosition = stage.getPointerPosition();
  }
});

stage.on('mouseup', () => {
  isDragging = false;
});

stage.on('mousemove', (e) => {
  if (isDragging) {
    const dx = e.evt.clientX - lastPointerPosition.x;
    const dy = e.evt.clientY - lastPointerPosition.y;
    const newX = stage.x() + dx;
    const newY = stage.y() + dy;

    const minX = window.innerWidth - mapWidth;
    const minY = window.innerHeight - mapHeight;
    const maxX = 0;
    const maxY = 0;

    stage.position({
      x: Math.min(maxX, Math.max(minX, newX)),
      y: Math.min(maxY, Math.max(minY, newY)),
    });

    lastPointerPosition = stage.getPointerPosition();
    layer.draw();
  }
});

let selectedTile = null;
let mousePressStartTime = 0;

stage.on('mousedown', (e) => {
  if (e.evt.button === 0) {
    mousePressStartTime = Date.now();
  }
});

stage.on('mouseup', (e) => {
  if (Date.now() - mousePressStartTime > 500) {
    const pos = stage.getPointerPosition();
    const roundedX = Math.floor(pos.x / tileSize) * tileSize;
    const roundedY = Math.floor(pos.y / tileSize) * tileSize;
    selectedTile = { x: roundedX, y: roundedY };
    const action = prompt('Select an action: Move');
    if (action && action.toLowerCase() === 'move') {
      socket.emit('updatePosition', { x: selectedTile.x, y: selectedTile.y });
    }
  }
  mousePressStartTime = 0;
});

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

  for (let x = 0; x <= mapWidth; x += tileSize) {
    const line = new Konva.Line({
      points: [x, 0, x, mapHeight],
      ...lineAttrs,
    });
    layer.add(line);
  }

  for (let y = 0; y <= mapHeight; y += tileSize) {
    const line = new Konva.Line({
      points: [0, y, mapWidth, y],
      ...lineAttrs,
    });
    layer.add(line);
  }
}

function drawMapBorder() {
  const rect = new Konva.Rect({
    x: mapBorderWidth,
    y: mapBorderWidth,
    width: mapWidth - borderWidth,
    height: mapHeight - borderWidth + mapBorderWidth,
    stroke: mapBorderColor,
    strokeWidth: borderWidth,
  });
  layer.add(rect);
}

function updatePlayers() {
  layer.destroyChildren();
  drawTileBorders();
  drawMapBorder();

  Object.keys(players).forEach((playerId) => {
    const player = players[playerId];

    const x = Math.min((Math.floor(player.x / tileSize) + 0.5) * tileSize, mapWidth - 20);
    const y = Math.min((Math.floor(player.y / tileSize) + 0.5) * tileSize, mapHeight - 20);

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