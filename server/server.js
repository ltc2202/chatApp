const path = require('path');
const http  = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const mongoose = require('./db/mongoose');
const _ = require('lodash');

const {UserModel} = require('./models/user');
const {Users} = require('./utils/users');
const {isRealString} = require('./utils/validation');
const {generateMessage, generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

var users = new Users();

app.use(express.static(publicPath));
app.use(bodyParser.json());

io.on('connection', (socket) => {
  console.log('New user connection');

  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }

    socket.join(params.room);

    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);

    if(user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }

    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);
    if(user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }

  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if(user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });
});

app.post('/users', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'name', 'password']);
    const user = new UserModel(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post('/users/me', async (req, res) => {
  const body = _.pick(req.body, ['email', 'password', 'name']);
  if(!body.email) {
    try {
      const user = await UserModel.findByName(body.name, body.password);
      const token = await user.generateAuthToken();
      res.header('x-auth', token).send(user);
    } catch (e) {
      res.status(400).send(e);
    }

  } else {
      try {
        const user = await UserModel.findByEmail(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
      } catch (e) {
        res.status(400).send(e);
      }
  }
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
