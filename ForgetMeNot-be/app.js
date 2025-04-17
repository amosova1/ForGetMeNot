var express = require('express');
const { sequelize, connectDB } = require("./sequelize");
const cors = require('cors');

const User = require("./models/user");

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var tagsRouter = require('./routes/tags');
var sectionsRouter = require('./routes/sections');
var userItemsRouter = require('./routes/userItems');
var accountsRouter = require('./routes/accounts');
var itemsRouter = require('./routes/items');
var itemAccountRouter = require('./routes/updateItems');
var authorsRouter = require('./routes/authors');

var app = express();
// app.use(express.json());

connectDB();
// sequelize.sync({ force: process.env.RECREATE_DB === 'true' })
//     .then(() => console.log("Tables have been created."))
//     .catch(err => console.error("Error creating tables:", err));
//

const session = require('express-session');
require('dotenv').config();

if (process.env.STATUS === 'production') {
    app.set('trust proxy', 1); // trust first proxy
}

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'dev-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.STATUS === 'production', // send only over HTTPS
            httpOnly: true, // JS can't access cookie
            sameSite: process.env.STATUS === 'production' ? 'none' : 'lax', // 'none' allows cross-site in production
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        }
    })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// app.use(cors({
//     origin: 'http://localhost:5173',
// }));

// const PORT = 3000;
//
// app.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
// });

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/tags', tagsRouter);
app.use('/sections', sectionsRouter);
app.use('/userItems', userItemsRouter);
app.use('/accounts', accountsRouter);
app.use('/items', itemsRouter);
app.use('/updateItems', itemAccountRouter);
app.use('/authors', authorsRouter);

module.exports = app;
