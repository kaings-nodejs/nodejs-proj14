const mongodb = require('mongodb');
const getDB = require('../util/database').getDB;

class User {
    constructor(username, email) {
        this.username = username;
        this.email = email;
    }

    save() {
        const db = getDB();
        return db.collection('user').insertOne(this);
    }

    static findById(userId) {
        const db = getDB();
        return db.collection('users').findOne({ _id: new mongodb.ObjectId(userId) });   // this will return the object instead. "find()" will return cursor. Therefore, need "next()" or "toArray()"
    }
}

module.exports = User;