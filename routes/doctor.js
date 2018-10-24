var express = require('express');
var Doctor = require('../models/doctor');
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

    Doctor.find({})
        .skip(offset)
        .limit(limit)
        .populate('user', 'name email')
        .populate('hospital')
        .exec((err, doctors) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al obtener medicos',
                    err
                });
            }

            if (!doctors.length) {
                return res.status(404).json({
                    ok: false,
                    message: 'No se encontraron medicos'
                });
            }

            Doctor.countDocuments((err, total) => {
                res.status(200).json({
                    ok: true,
                    'Nuevo medico': doctors,
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
        doctor = new Doctor({
            name: body.name,
            img: body.img,
            hospital: body.hospital,
            user: req.user._id
        });

    doctor.save((err, savedDoctor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al crear medico',
                err
            });
        }

        res.status(200).json({
            ok: true,
            'Nuevo medico': savedDoctor
        });
    });
});

// ================================================
// ================= Actualizar medico
// ================================================
app.put('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id,
        body = req.body;

    Doctor.findById(id, (err, doctor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'El medico no fue encontrado',
                err
            });
        }

        if (!doctor) {
            return res.status(400).json({
                ok: false,
                message: `El medico con el id ${ id } no existe`,
                err: { message: 'No existe un medico con ese ID' }
            });
        }

        doctor.name = body.name;
        doctor.img = body.img

        doctor.save((err, savedDoctor) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar medico',
                    err
                });
            }

            res.status(200).json({
                ok: true,
                'Medico actualizado': savedDoctor
            });
        });
    });
});

// ================================================
// ================= Eliminar medico
// ================================================
app.delete('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id;

    Doctor.findByIdAndRemove(id, (err, deletedDoctor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar medico',
                err
            });
        }

        if (!deletedDoctor) {
            return res.status(400).json({
                ok: false,
                message: `El medico con el id ${ id } no existe`,
                err: { message: 'No existe un medico con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            'Medico eliminado': deletedDoctor
        });
    });
});

module.exports = app;