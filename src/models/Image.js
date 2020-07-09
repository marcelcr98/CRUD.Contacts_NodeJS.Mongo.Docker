const { Schema, model } = require('mongoose');

const imageSchema = new Schema({
    nombre: {type: String},
    apellido: {type: String},
    correo: {type: String},
    fecha: {type: String},
    filename: {type: String},
    path: {type: String},
    originalname: {type: String},
    mimetype: {type: String},
    size: { type: Number},
    created_at: {type: Date, default: Date.now()}
});

module.exports = model('Image', imageSchema);