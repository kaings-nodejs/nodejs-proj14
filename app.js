const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(helmet());  // Helmet helps you secure your Express apps by setting various HTTP headers. It’s not a silver bullet, but it can help! You can check in network, localhost check for the Response Header! before vs after using helmet
app.use(compression());    // use compression to compress web assets, such as html, css, js. But, not include image files (there is other way to compress image assets)
app.use(morgan('combined'));      // use morgan to provide logging service in express app (using this code, it will print the logging in the console). ref: https://www.npmjs.com/package/morgan

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


console.log('[PRINT] process.env..... ', process.env);  // you can see that all the environment variables can be access from here
console.log('[PRINT] process.env.NODE_ENV..... ', process.env.NODE_ENV);    // for production, production server will AUTOMATICALLY set NODE_ENV as 'production'. But, for now it will be set as 'undefined'

/* 
instead of in the code (NOT recommended), set the credential & sensitive info in the environment variable.
In nodejs, environment variables that are set can be access via 'process.env' (can console log to see more details).
For nodemon (since we use for dev environment), we can set additional environment variables in 'nodemon.json'.
But, since we only use nodemon for development, this is not good choice for production
 */
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-lkalu.mongodb.net/${process.env.MONGO_DATABASE}`
    )  
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