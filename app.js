const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {   // this will be run when there is any incoming request. it is put on top of all routes. All incoming request will trigger this middleware
    User.findById('5cbeddce7f959c02b4ba222c')
    .then(user => {
        console.log('user..... ', user);
        req.user = new User(user.username, user.email, user._id, user.cart);    // store object "user" into "req.user" so that it can be called/used globally
        next();     // move to the next middleware
    })
    .catch(err => {console.log(err)});
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
});