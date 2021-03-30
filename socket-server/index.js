const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});



let mobileClients = [];
let worldClient = null;


io.on('send', (bubble) => {
  bubbles.push(bubble)
});

io.on('blow', (bubbleId) => {

});

io.on('connection', (socket) => {
  console.log('new client connected');
  console.log("Query: ", socket.handshake.query);

  // Add socket to list
  const type = socket.handshake.query.clientType
  if( type == 'mobile'){
    mobileClients.push(socket)
  }else if(type == 'world'){
    worldClient = socket;
  }

  socket.on('transfer image', (img) => {
    io.to(worldClient.id).emit('transfer image', img)
  })


  socket.on('send to world', (bubble) => {
    console.log("got bubble sent to me", bubble)

    if(!worldClient) return;
    io.to(worldClient.id).emit('send to world', bubble)
  })

  socket.on('blow', (blowInfo) => {
    console.log("🚀 ~ file: index.js ~ line 53 ~ socket.on ~ blowInfo", blowInfo)
    
    if(!worldClient) return;
    io.to(worldClient.id).emit('blow', blowInfo)
  })

  socket.on('send to client', (bubble) => {
    mobileClients.forEach(client =>{
      io.to(client.id).emit('send to client')
    });
  })


  
  socket.on('disconnect', () => {
    console.log('client disconnected');
  });

  // socket.on('chat message', (msg) => {
  //   io.emit('chat message', msg);
  // });
});

server.listen(7777, () => {
  console.log('listening on port 7777');
});