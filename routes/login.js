const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const SEED = require('../config/config').SEED;
const CLIENT_ID = require('../config/config').CLIENT_ID;

// Inicializaciones
const app = express();
// Google
const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        // [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture
    }
}


//===============================================
//------------- Autenticación por Google
//===============================================
app.post('/google', async(req, res) => {
    let token = req.body.token;

    const googleUser = await verify(token)
        .catch(() => {
            return res.status(400).json({
                ok: false,
                message: 'Token no valido!'
            });
        })

    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                err: err
            });
        }

        if (userDB) {
            if (userDB.google == true) {
                // Crear token!!
                let token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 }); // 4 horas
                res.status(200).json({
                    ok: true,
                    userDB: userDB,
                    token: token
                });
            } else {
                return res.status(400).json({
                    ok: false,
                    message: 'Inicie sesión de la otra forma pues ud ya se encuentra registrado'
                });
            }

        } else {
            // Crear usuario
            let user = new User();

            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';

            user.save(( err, userDB ) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Error al crear usuarios',
                        err
                    });
                }
        
                // Crear token!!
                let token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 }); // 4 horas
                res.status(200).json({
                    ok: true,
                    userDB: userDB,
                    token: token
                });
            });
        }
    });
});

//===============================================
//------------- Autenticación normal
//===============================================
app.post('/', (req, res) => {
    let body = req.body;

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
        let token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 }); // 4 horas
        res.status(200).json({
            ok: true,
            userDB: userDB,
            token: token
        });

    });
});

module.exports = app;
