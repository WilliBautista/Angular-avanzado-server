var express = require('express');
var bcrypt = require('bcryptjs');
var User = require('../models/user');

// Inicializaciones
var app = express();

// ================================================
// ================= Obtener usuario
// ================================================
app.get('/', (req, res) => {
    User.find({}, 'name email img role')
        .exec((err, users) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al obtener usuarios',
                    err: err
                });
            }

            res.status(200).json({
                ok: true,
                users
            });
        });
});

// ================================================
// ================= Actualizar usuario
// ================================================

app.put('/:id', (req, res) => {
    var id = req.params.id,
        body = req.body;

    User.findById(id, 'name email role', (err, user) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                message: 'El usuario no fue encontrado',
                err: err
            });
        }

        if (!user) {
            return res.status(400).json({
                ok: false,
                message: `El usuario con el id ${ id } no existe`,
                err: { message: 'No existe un usuario con ese ID' }
            });
        }

        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save((err, savedUser) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar usuario',
                    err: err
                });
            }

            res.status(200).json({
                ok: true,
                user: savedUser
            });
        });
    });
});

// ================================================
// ================= Guardar usuario
// ================================================

app.post('/', (req, res) => {

    var body = req.body,
        user = new User({
            name: body.name,
            password: bcrypt.hashSync(body.password, 10),
            email: body.email,
            img: body.img,
            role: body.role
        });

    user.save((err, savedUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al guardar usuarios',
                err: err
            });
        }

        res.status(201).json({
            ok: true,
            user: savedUser
        });
    });

});

// ================================================
// ================= Eliminar usuario
// ================================================

app.delete('/:id', (req, res) => {
    var id = req.params.id;

    User.findByIdAndRemove(id, (err, deletedUser) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar usuario',
                err: err
            });
        }

        if (!deletedUser) {
            return res.status(400).json({
                ok: false,
                message: `El usuario con el id ${ id } no existe`,
                err: { message: 'No existe un usuario con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            user: deletedUser
        });
    });
});

module.exports = app;