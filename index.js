const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require("mongoose");
const mongoDB = 'mongodb+srv://admin:admin@chat-app-simple.qj7of.mongodb.net/chat-app-simple?retryWrites=true&w=majority';
const Msg = require('./models/messages');

mongoose.connect(mongoDB,{useNewUrlParser: true,useUnifiedTopology:true}).then(() => {
  console.log('connected to mongodb');
}
).catch(err => console.log(err));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

  Msg.find().then(result=>{
    socket.emit('output-messages',result )
  }
  )


  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', (msg) => {
    // console.log('message: ' + msg);

    const message = new Msg({msg});
    message.save().then(() => {
      io.emit('chat message',msg);
    }
    )
    
  });


});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

