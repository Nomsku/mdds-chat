'use strict';

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const users = [];

app.use(express.static('public'));

const getUserList = () => {
    let userList = '';
    for (const user of users) {
        userList += user.username + '\n';
    }
    return userList;
};
const getUserName = (socketId) => {
    return users.find(user => user.id === socketId)?.username;
};
const deleteUserById = (socketId) => {
    try {
        const index = users.findIndex(user => user.id === socketId);
        console.log('deleting user', users[index]);
        users.splice(index, 1);
    }catch (error) {
        console.warn('deleting user failed', error);
    }
};



io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  let curRoom;
  socket.on('join', (username) => {
    users.push({username: username, id: socket.id});
    console.log('users connected:', users);
    socket.join('curRoom');
    socket.emit('response', 'Joined with username ' + username);
    socket.emit('chat message', `Hello ${username}! Users online: ${getUserList()}`);
    socket.emit('chat message', `Remember to join a room before chatting  ${username}!`);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected', socket.id);
    deleteUserById(socket.id);
  });

  socket.on('chat message', (msg) => {
    console.log('message by: ' + socket.id, msg);
    if (msg === '!users'){
        socket.emit('chat message', `Users online: ${getUserList()}`);
    } else {
      if (curRoom === 'room1') io.to('room1').emit('chat message', `${getUserName(socket.id)}: ${msg}`);
      if (curRoom === 'room2') io.to('room2').emit('chat message', `${getUserName(socket.id)}: ${msg}`);
      if (curRoom === 'room3') io.to('room3').emit('chat message', `${getUserName(socket.id)}: ${msg}`);
    }
  });

  socket.on('joinRoom', (rooms) => {
    socket.join(rooms);
    curRoom = rooms;
    socket.emit('chat message', `you joined ` + rooms);
    console.log('joined a room: ' + rooms);
  });
});



http.listen(3000, () => {
  console.log('listening on port 3000');
});