const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://actfun07_user1:actfun07_pwuser1@cluster0-j3s72.mongodb.net/test?retryWrites=true')
    .then(client => {
        console.log('connected!');
        callback(client);
    })
    .catch(err => {console.log(err)});
};

module.exports = mongoConnect;