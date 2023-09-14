'use strict';

// Server URL below must point to your server, localhost works for local development/testing
const socket = io('http://localhost:3000');

const messages = document.getElementById('messages');
const msgForm = document.getElementById('input-form');
const msgInput = msgForm.getElementsByTagName('input')[0];
const joinForm = document.getElementById('join-form');
const usernameInput = joinForm.getElementsByTagName('input')[0];
document.getElementById('chat').classList = 'hidden';

msgForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (msgInput.value) {
      socket.emit('chat message', msgInput.value);
      msgInput.value = '';
    }
  });
  
  joinForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (usernameInput.value) {
      socket.emit('join', usernameInput.value);
      usernameInput.value = '';
      document.getElementById('login').classList = 'hidden';
      document.getElementById('chat').classList = '';
      msgInput.focus();
    }
  });

socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  item.innerHTML = msg;
  document.getElementById('messages').appendChild(item);
});