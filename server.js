const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const config = require('./config');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/map_data.json', (req, res) => {
  fs.readFile(path.join(__dirname, 'map_data.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading map data:', err);
      res.status(500).send('Error reading map data');
      return;
    }
    res.json(JSON.parse(data));
  });
});

server.listen(config.port, () => {
  console.log(`Server started`);
});
