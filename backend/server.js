let express = require('express');
let app = express();
let expressWs = require('express-ws')(app);
const uuid = require('uuid/v4');
const Room = require('./models/Room.js');
let rooms = {};
let users = {};

app.use(function (req, res, next) {
    console.log('middleware');
    req.testing = 'testing';
    return next();
});

app.get('/', function(req, res, next){
    console.log('get route', req.testing);
    res.end();
});

app.ws('/rpg-skribbl/game-ws', function(ws, req) {
    ws.on('message', function(msg) {
        console.log(req);
        let decoded = JSON.parse(msg);
        console.log(decoded);
        if(decoded.type === 'newMsg') {
            const roomId = uuid();
            const userId = req.headers['sec-websocket-key'];
            rooms[roomId] = new Room(userId);
            users[userId] = roomId;
        } else if (decoded.type === 'joinRoom') {

        } else if (decoded.type === 'newMsg') {
            ws.send(JSON.stringify({
                type: 'newMsg',
                userId: decoded.userId,
                color: 'black',
                text: decoded.text,
                id: 0,
                timestamp: Date.now()
            }));
        }
    });
    console.log('socket', req.testing);
});

app.listen(8888);