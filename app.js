const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {   // this will be run when there is any incoming request. it is put on top of all routes. All incoming request will trigger this middleware
    User.findById('5d4c4428dd60d513b9ccb0d6')
    .then(user => {
        console.log('user..... ', user);
        req.user = user;   // store mongoose object "user" into "req.user" so that it can be called/used globally
        next();     // move to the next middleware
    })
    .catch(err => {console.log(err)});
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://gr33nlink17:Qxcg2ZMfxJ20sxaf@cluster0-lkalu.mongodb.net/shop')
.then(result => {
    console.log(result);

    User.findOne().then(currentUser => {
        console.log('mongoose.connect_currentUser..... ', currentUser);

        if (!currentUser) {
            const user = new User({
                username: 'Will',
                email: 'will@abc.com',
                cart: { items: [] }
            });

            user.save();
        }

        app.listen(3000);
    });
})
.catch(err => {console.log(err)});