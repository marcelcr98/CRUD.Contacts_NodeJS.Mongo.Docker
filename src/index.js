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
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET } =  process.env;
const routes = require('./routes');
passport.use(new Strategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/return'
  },
  (accessToken, refreshToken, profile, cb) => {
    return cb(null, profile);
}));


const { FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, SESSION_SECRET2 } =  process.env;
passport.use(new FacebookStrategy({
  clientID: FACEBOOK_CLIENT_ID,
  clientSecret: FACEBOOK_CLIENT_SECRET,
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
require('./database');

// settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

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
app.use(require('express-session')({ secret: SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(require('express-session')({ secret: SESSION_SECRET2, resave: true, saveUninitialized: true }));


app.use(passport.initialize());
app.use(passport.session());
app.use(require('./routes/index'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

// start
app.listen(3000, () => {
    console.log(`Server on port ${app.get('port')}`);
});
