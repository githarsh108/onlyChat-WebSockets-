const express = require('express');

const http = require('http');
const path = require('path');
const app = express();
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users')
const server = http.createServer(app);
const io = socketio(server);

//set static folder 

app.use(express.static(path.join(__dirname,'public')));

const botName = 'Admin';

//run when client connects
io.on('connection', socket => {
    // console.log('New ws connection...');

    socket.on('joinRoom', ({username, room}) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);


        //welcome current user
        socket.emit('message',formatMessage(botName,'Welcome to onlyChat'));

        //broadcast when a user coontacts
        socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined`));
    });

    // io.to(user.room).emit('roomUsers', {
    //     room : user.room,
    //     users:getRoomUsers(user.room)
    // });

    //listen for chatMessage

    socket.on('chatMessage', msg => {
        //user ki id de raha hai
        const user = getCurrentUser(socket.id);
        //ye us user id ke naam ki emit krke ui me show kr rh h 
        io.to(user.room).emit('message',formatMessage(user.username, msg));
    });

    //runs when client disconnect
    socket.on('disconnect', () => {

        const user = userLeave(socket.id);

        // if(user){
            // io.to(user.room).emit('message',formatMessage(botName,`${user.username} entity left`));

        // }

    });

 

});
const PORT = process.env.PORT || 3000 ;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));



// const PORT = process.env.PORT || 3000 ;

// server.listen(PORT, () => console.log(`Server running on ${PORT}`));
