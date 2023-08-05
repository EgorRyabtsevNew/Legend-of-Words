fetch('/map_data.json')
  .then((response) => response.json())
  .then((data) => {
    drawMap(data);
  })
  .catch((error) => console.error('Error fetching map data:', error));

function drawMap(mapData) {
  const container = document.getElementById('container');
  const stage = new Konva.Stage({
    container: 'container',
    width: 800,
    height: 600,
  });
  const layer = new Konva.Layer();

  mapData.forEach((tileData) => {
    const { id, type } = tileData;
    const [x, y] = id.split('-').map(Number);
    const rect = new Konva.Rect({
      x: x * 50,
      y: y * 50,
      width: 51,
      height: 51,
      fill: getTileColor(type),
    });
    layer.add(rect);
  });

  stage.add(layer);
}

function getTileColor(type) {
  switch (type) {
    case 'plain':
      return 'palegreen'; 
    case 'water':
      return 'lightblue';
    default:
      return 'limegreen';
  }
}