var socket = io();

socket.on('connect', function() {
  console.log('Connected to server');

  socket.emit('createEmail', {
    to: 'ltc@gmail.com',
    text: 'Hey. This is Harry'
  });

  socket.emit('createMessage',{
    to: 'amy',
    text: 'What are u doing?'
  });

});

socket.on('disconnect', function() {
  console.log('Disconnect from server');
});

socket.on('newEmail', function(email) {
  console.log('New Email!', email);
});

socket.on('newMessage', function(message) {
  console.log('From:', message.from);
  console.log('Message:', message.text);
});
