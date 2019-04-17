const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://actfun07_user1:actfun07_pwuser1@cluster0-j3s72.mongodb.net/shop?retryWrites=true')
    .then(client => {
        console.log('connected!');
        _db = client.db();  // create db automatically if not available, it will create it on the fly

        /* 
        example above:
        - in the URL, the db "shop" will be created ... client.db()
        - if client.db('dummy'), the db "dummy" will be created instead of "shop"
        */

        callback();
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
};

const getDB = () => {
    if (_db) {
        return _db;
    }
    throw "No DB Found!"
}


exports.mongoConnect = mongoConnect;
exports.getDB = getDB;