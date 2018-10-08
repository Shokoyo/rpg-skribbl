class Room {
    constructor(host) {
        this.host = host;
        this.users = [host];
    }

    addUser(user) {
        this.users = [user, ...this.users];
    }
}

module.exports = Room;