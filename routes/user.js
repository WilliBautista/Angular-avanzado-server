var express = require('express');
var bcrypt = require('bcryptjs');
var User = require('../models/user');
var mdAuthentication = require('../middleware/authentication');

// Inicializaciones
var app = express();

// ================================================
// ================= Obtener usuario
// ================================================
app.get('/', (req, res) => {
    var offset = req.query.offset || 0,
        limit = req.query.limit || 5;

    offset = Number(offset);
    limit = Number(limit);

    User.find({}, 'name email img role')
        .skip(offset)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al obtener usuarios',
                    err
                });
            }

            User.countDocuments((err, total) => {
                res.status(200).json({
                    ok: true,
                    users,
                    total
                });
            });
        });
});

// ================================================
// ================= Guardar usuario
// ================================================

app.post('/', mdAuthentication.verifyToken, (req, res) => {

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
                err
            });
        }

        res.status(201).json({
            ok: true,
            user: savedUser,
            userToken: req.user
        });
    });

});

// ================================================
// ================= Actualizar usuario
// ================================================

app.put('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id,
        body = req.body;

    User.findById(id, 'name email role', (err, user) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                message: 'El usuario no fue encontrado',
                err
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
                    err
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
// ================= Eliminar usuario
// ================================================

app.delete('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id;

    User.findByIdAndRemove(id, (err, deletedUser) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar usuario',
                err
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
