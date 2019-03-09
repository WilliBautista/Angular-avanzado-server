const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const mdAuthentication = require('../middleware/authentication');

// Inicializaciones
const app = express();

// ================================================
// ================= Obtener usuario
// ================================================
app.get('/', (req, res) => {
    let offset = req.query.offset || 0,
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

app.post('/', (req, res) => {
    let body = req.body,
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
                message: 'Error al crear usuarios',
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
    let id = req.params.id,
        body = req.body;

    User.findById(id, (err, user) => {
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
        user.role = body.role;

        if (!user.google) {
            user.email = body.email;
        }

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
    let id = req.params.id;

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
