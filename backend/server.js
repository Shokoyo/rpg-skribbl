const app = require('express');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.origins('*:*');
const uuid = require('uuid/v4');
const Room = require('./models/Room.js');
let rooms = {};
let users = {};
let _ = require('lodash');

/*app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.end();
});*/

// app.get('/', function(req, res, next){
//     console.log('get route', req.testing);
//     res.end();
// });

io.on('connection', client => {
    console.log('User connected, id: ' + client.id);
    let _userId = '';
    let timeout = null;
    client.on('join room', (roomId, userName, userId) => {
        if(!rooms.hasOwnProperty(roomId)) {
            client.send('invalid room');
        } else {
            console.log(userId);
            users[userId] = {
                client: client,
                room: roomId,
                userName: userName,
                userId: userId,
                connected: true,
                avatar: {}
            };
            const room = rooms[roomId];
            room.addUser(users[userId]);
            room.serverMessage('Hallo!');
            client.join(roomId);
            _userId = userId;
        }
    });

    client.on('create room', (userName, userId) => {
        const roomId = uuid();
        users[userId] = {
            userName: userName,
            userId: userId,
            room: roomId,
            connected: true,
            client: client,
            avatar: {}
        };
        rooms[roomId] = new Room(users[userId], io, roomId);
        rooms[roomId].serverMessage('Created room with id ' + roomId);
        client.join(roomId);
        _userId = userId;
    });

    client.on('reconnect', userId => {
        clearTimeout(timeout);
        console.log('Reconnect');
        const user = users[userId];
        if(user !== undefined) {
            users[userId].client = client;
            users[userId].connected = true;
        }
        const room = rooms[users[userId].roomId];
        if(room !== undefined) {
            room.updateClient(users[userId]);
        }
    });

    client.on('disconnect', () => {
        console.log('Disconnect');
        if(users[_userId] !== undefined) {
            users[_userId].connected = false;
            timeout = setTimeout(function() {
                rooms[users[_userId].room].removeUser(_userId);
            }, 10000);
        }
    });

    client.on('new message', message => {
        console.log(message);
        io.emit('new message', {
            userName: message.userName,
            color: 'black',
            text: message.text,
            id: 0,
            timestamp: Date.now()
        });
    });
});

server.listen(8888);