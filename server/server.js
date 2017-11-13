const path = require('path');
const http  = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connection');

  socket.emit('newEmail', {
    from: 'Amy',
    text: 'Hey. Miss me?',
    createdAt: 123
  });

  socket.on('createEmail', (newEmail) => {
    console.log('createEmail', newEmail);
  });

  socket.emit('newMessage', {
    from: 'Messi',
    text: 'Hello everyone!',
    createdAt: Date.now()
  });

  socket.on('createMessage', (message) => {
    console.log('To:', message.to);
    console.log('Message:', message.text);
  });


  socket.on('disconnect', () => {
    console.log('User was disconnected')
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
