const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


let bubbles = [];

let bubble = {
  flying: false,
  client: 12,
  posX: 0,
  posY: 0,
  imagePath: '',
}

io.on('send', (bubble) => {
  bubbles.push(bubble)
});

io.on('blow', (bubbleId) => {

});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

http.listen(3333, () => {
  console.log('listening on *:3333');
});