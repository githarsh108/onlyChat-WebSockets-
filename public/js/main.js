const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
// const username = document.querySelector('.meta');

const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
//getting the username and room from url
const {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix : true
});

console.log(username,room);

const socket = io();

//join chatroom

socket.emit('joinRoom',{username, room});


//get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
})

socket.on('message',message =>{
    console.log(message);

    outputMessage(message);

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


//message submit
chatForm.addEventListener('submit',(e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    //emit message to server
    socket.emit('chatMessage',msg);

  
    //clear inputs
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

//ouptut msg to dom
function outputMessage(message){
 const div = document.createElement('div');   
 div.classList.add('message');
//  div.classList.add('meta');
 div.innerHTML = `
    <p class="meta"> ${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//add room name to dom
function outputRoomName(room){
    roomName.innerText = room;
}

//add user to dom

function outputUsers(users){
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}