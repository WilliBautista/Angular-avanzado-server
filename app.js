// Base imports
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Route imports
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var hospitalRoutes = require('./routes/hospital');
var doctorRoutes = require('./routes/doctor');
var loginRoutes = require('./routes/login');
var searchRoutes = require('./routes/search');

// Inicialization
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.use('/user', userRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/doctor', doctorRoutes);
app.use('/login', loginRoutes);
app.use('/search', searchRoutes);
//-----------------------------
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});
