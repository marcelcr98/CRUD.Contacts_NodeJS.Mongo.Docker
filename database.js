const mongoose = require('mongoose');

const MONGO_USERNAME = 'userdemo';
const MONGO_PASSWORD = 'Tecsup';
const MONGO_HOSTNAME = '127.0.0.1';
const MONGO_PORT = '27017';
const MONGO_DB = 'contacts';

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true});