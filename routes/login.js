var express = require('express');
var bcrypt = require('bcryptjs');
var User = require('../models/user');
var jwt = require('jsonwebtoken');

// Inicializaciones
var app = express();

app.post('/', (req, res) => {
    var body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error en la autenticación',
                err: err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - email',
                err: err
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - password',
                err: err
            });
        }

        userDB.password = '¬(*.*)/';

        // Crear token!!
        var token = jwt.sign({ usuario: userDB }, 'admin-pro-token-generar-hard', { expiresIn: 14400 }); // 4 hotas
        res.status(200).json({
            ok: true,
            userDB: userDB,
            token: token
        });

    });
});



module.exports = app;