let _ = require('lodash');

class Room {
    constructor(host, io, roomId) {
        host.host = true;
        host.score = 0;
        this.host = host;
        this.users = {};
        this.users[host.userId] = host;
        this.nextMessageId = 0;
        this.io = io;
        this.roomId = roomId;
        this.sendUserlist();
    }

    addUser(user) {
        user.host = false;
        user.score = 0;
        this.users[user.userId] = user;
        this.sendUserlist();
    }

    removeUser(userId) {
        console.log('User ' + userId + " left");
        console.log(this.users);
        const user = this.users[userId];
        this.serverMessage(user.userName + ' left the game.');
        delete this.users[userId];
    }

    sendUserlist() {
        let userList = {};
        for(let key in this.users) {
            userList[key] = _.pick(this.users[key],'host','userName','userId','score', 'avatar');
        }
        console.log(userList);
        this.io.to(this.roomId).emit('userlist', userList);
    }

    sendMessage(message) {
        this.io.to(this.roomId).emit('new message', {
            userName: message.userName,
            color: 'black',
            text: message.text,
            id: 0,
            timestamp: Date.now()
        });
    }

    serverMessage(message) {
        this.io.to(this.roomId).emit('new message', {
                userName: 'Server',
                color: 'blue',
                text: message,
                timestamp: Date.now()
        });
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
