'use strict';
const { Router } = require('express');

const path = require('path');
const { unlink } = require('fs-extra');
const router = Router();
const passport = require('passport');
const cloudinary = require('cloudinary');

cloudinary.config({

    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET


});
const fs = require('fs');
// Models
const Image = require('../models/Image');

router.get('/', async (req, res,next) => {
    const images = await Image.find();
    const { user } = req;
    res.render('index', { images,user });
});




//Google auth
router.get('/login/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

router.get('/return', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res, next) => {
    res.redirect('/');
});

//Facebook auth
router.get('/login/facebook', passport.authenticate('facebook'));



router.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res, next) => {
    res.redirect('/');
});

//routers images

router.get('/upload', (req, res) => {
    const { user } = req;
    res.render('upload', {  user });
});



router.post('/upload', async (req, res) => {
    const image = new Image();
    image.nombre = req.body.nombre;
    image.apellido = req.body.apellido;
    image.correo = req.body.correo;
    image.fecha = req.body.fecha;
    image.filename = req.file.filename;
    image.path = '/img/uploads/' + req.file.filename;
    image.originalname = req.file.originalname;
    image.mimetype = req.file.mimetype;
    image.size = req.file.size;

    const result = await cloudinary.v2.uploader.upload(req.file.path);
    console.log(result)
    await image.save();
    res.redirect('/');
    res.render('profile', { image });
    
});

router.get('/image/:id', async (req, res) => {
    const { id } = req.params;
    const image = await Image.findById(id);
    const { user } = req;
    res.render('profile', { image, user });
});

router.get('/image/:id/delete', async (req, res) => {
    const { id } = req.params;
    const imageDeleted = await Image.findByIdAndDelete(id);
    await unlink(path.resolve('./src/public' + imageDeleted.path));
    res.redirect('/');
});

module.exports = router;