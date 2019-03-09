// Base imports
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Route imports
const appRoutes = require('./routes/app');
const userRoutes = require('./routes/user');
const hospitalRoutes = require('./routes/hospital');
const medicRoutes = require('./routes/medic');
const loginRoutes = require('./routes/login');
const searchRoutes = require('./routes/search');
const uploadRoutes = require('./routes/upload');
const imagesRoutes = require('./routes/images');

// Inicialization
const app = express();

// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/hospitalDB', {
        useCreateIndex: true,
        useNewUrlParser: true
    }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.use('/user', userRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medic', medicRoutes);
app.use('/login', loginRoutes);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/images', imagesRoutes);
//-----------------------------
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3500, () => {
    console.log('Express server puerto 3500: \x1b[32m%s\x1b[0m', 'online');
});
