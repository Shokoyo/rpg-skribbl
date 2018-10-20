let _ = require('lodash');

class Room {
    constructor(host, io, roomId) {
        host.isHost = true;
        host.score = 0;
        host.finished = false;
        this.host = host;
        this.users = {};
        this.users[host.userId] = host;
        this.nextMessageId = 0;
        this.io = io;
        this.roomId = roomId;
        this.playing = false;
        this.currentWord = '';
        this.rounds = 0;
        this.sendUserList();
    }

    startGame(rounds) {

    }

    addLine(line, userId) {
        //TODO: Check if user is drawing
        if(true) {
            this.io.to(this.roomId).emit('new line', line);
        }
    }

    addUser(user) {
        user.isHost = false;
        user.score = 0;
        user.finished = false;
        this.users[user.userId] = user;
        this.sendUserList();
    }

    removeUser(userId) {
        console.log('User ' + userId + " left");
        console.log(this.users);
        const user = this.users[userId];
        this.serverMessage(user.userName + ' left the game.');
        delete this.users[userId];
    }

    sendUserList() {
        let userList = {};
        for(let key in this.users) {
            userList[key] = _.pick(this.users[key],'host','userName','userId','score', 'avatar');
        }
        console.log(userList);
        this.io.to(this.roomId).emit('userlist', userList);
    }

    sendMessage(message) {
        if(this.playing && message.text === this.currentWord) {
            //User guessed correctly

        }
        if(this.users[message.userId].finished) {
            //User already guessed the word, use separate channel

        } else {
            this.io.to(this.roomId).emit('new message', {
                userName: message.userName,
                color: 'black',
                text: message.text,
                id: 0,
                timestamp: Date.now()
            });
        }
    }

    serverMessage(message) {
        this.io.to(this.roomId).emit('new message', {
                userName: 'Server',
                color: 'blue',
                text: message,
                timestamp: Date.now()
        });
    }

    startGame(rounds, userId) {
        console.log('User id: ' + userId);
        if(this.users[userId].isHost) {
            this.playing = true;
            this.rounds = rounds;
            console.log('Start');
            //TODO do start stuff
        }
    }

    togglePause(userId) {
        if(this.users[userId].isHost) {
            console.log('Toggle pause');
            this.playing = !this.playing;
            this.io.to(this.roomId).emit('toggle pause', this.playing);
            //TODO broadcast pause? do something else?
        }
    }

    updateClient(user) {
        if(this.users.hasOwnProperty(user.userId)) {
            console.log('reconnected');
            this.users[user.userId] = user;
        } else {
            //timed out: rejoin as new user
            this.addUser(user);
        }
    }
}

module.exports = Room;
