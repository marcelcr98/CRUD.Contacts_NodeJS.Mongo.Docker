'use strict';

require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const uuid = require('uuid/v4');
const passport = require('passport'),FacebookStrategy = require('passport-facebook').Strategy;
const { format } = require('timeago.js');

//Google auth
const { Strategy } = require('passport-google-oauth20');
const routes = require('./routes');
passport.use(new Strategy({
    clientID: '693670427570-9o4gve7d5gb4u0919sjr6r2i7kohvgiq.apps.googleusercontent.com',
    clientSecret: 'm31_ppqLI7youiduSSu3VJqM',
    callbackURL: '/return'
  },
  (accessToken, refreshToken, profile, cb) => {
    return cb(null, profile);
}));


passport.use(new FacebookStrategy({
  clientID: '758841867988127',
  clientSecret: '8b078633b67cff553456e0824fbc74be',
  callbackURL: '/auth/facebook/callback'
},
(accessToken, refreshToken, profile, cb) => {
  return cb(null, profile);
}));
//passport

passport.serializeUser((user, cb) => {
    cb(null, user);
  });
  
  passport.deserializeUser((obj, cb) => {
    cb(null, obj);
  });


//require path

const path = require('path');

// intializations
const app = express();
const db = require('./database');

// settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const port = process.env.PORT || 8081;

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/uploads'),
    filename: (req, file, cb, filename) => {
        console.log(file);
        cb(null, uuid() + path.extname(file.originalname));
    }
}) 
app.use(multer({storage}).single('image'));

// Global variables
app.use((req, res, next) => {
    app.locals.format = format;
    next();
});

// routes
app.use(require('express-session')({ secret: 'choose-a-random-string', resave: true, saveUninitialized: true }));
app.use(require('express-session')({ secret: 'choose-a-random-string', resave: true, saveUninitialized: true }));


app.use(passport.initialize());
app.use(passport.session());
app.use(require('./routes/index'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

// start
app.listen(port, function () {
  console.log('Example app listening on port 8081!')
})
