var express = require('express');
var Medic = require('../models/medic');
var mdAuthentication = require('../middleware/authentication');

var app = express();

// ================================================
// ================= Obtener medicos
// ================================================
app.get('/', (req, res) => {
    var offset = req.query.offset,
        limit = req.query.limit;

    offset = Number(offset);
    limit = Number(limit);

    Medic.find({})
        .skip(offset)
        .limit(limit)
        .populate('user', 'name email')
        .populate('hospital')
        .exec((err, medics) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al obtener medicos',
                    err
                });
            }

            if (!medics.length) {
                return res.status(404).json({
                    ok: false,
                    message: 'No se encontraron medicos'
                });
            }

            Medic.countDocuments((err, total) => {
                res.status(200).json({
                    ok: true,
                    'Nuevo medico': medics,
                    total
                });
            });
        });
});

// ================================================
// ================= Crear medico
// ================================================
app.post('/', mdAuthentication.verifyToken, (req, res) => {
    var body = req.body,
        medic = new Medic({
            name: body.name,
            img: body.img,
            hospital: body.hospital,
            user: req.user._id
        });

    medic.save((err, savedMedic) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al crear medico',
                err
            });
        }

        res.status(200).json({
            ok: true,
            'Nuevo medico': savedMedic
        });
    });
});

// ================================================
// ================= Actualizar medico
// ================================================
app.put('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id,
        body = req.body;

    Medic.findById(id, (err, medic) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'El medico no fue encontrado',
                err
            });
        }

        if (!medic) {
            return res.status(400).json({
                ok: false,
                message: `El medico con el id ${ id } no existe`,
                err: { message: 'No existe un medico con ese ID' }
            });
        }

        medic.name = body.name;
        medic.img = body.img

        medic.save((err, savedMedic) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar medico',
                    err
                });
            }

            res.status(200).json({
                ok: true,
                'Medico actualizado': savedMedic
            });
        });
    });
});

// ================================================
// ================= Eliminar medico
// ================================================
app.delete('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id;

    Medic.findByIdAndRemove(id, (err, deletedMedic) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar medico',
                err
            });
        }

        if (!deletedMedic) {
            return res.status(400).json({
                ok: false,
                message: `El medico con el id ${ id } no existe`,
                err: { message: 'No existe un medico con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            'Medico eliminado': deletedMedic
        });
    });
});

module.exports = app;