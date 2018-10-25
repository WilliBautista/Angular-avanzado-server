const express = require('express');
const Hospital = require('../models/hospital');
const mdAuthentication = require('../middleware/authentication');

const app = express();

// ================================================
// ================= Obtener hospitales
// ================================================

app.get('/', (req, res) => {
    let offset = req.query.offset,
        limit = req.query.limit;

    offset = Number(offset);
    limit = Number(limit);

    Hospital.find({})
        .skip(offset)
        .limit(limit)
        .populate('user', 'name email')
        .exec((err, hospitals) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al consultar hospitales',
                    err
                });
            }

            if (!hospitals.length) {
                return res.status(404).json({
                    ok: false,
                    message: 'No se encontraron hospitales'
                });
            }

            Hospital.countDocuments((err, total) => {
                res.status(200).json({
                    ok: true,
                    hospitals,
                    total
                });
            });
        });
});

// ================================================
// ================= Crear hospital
// ================================================
app.post('/', mdAuthentication.verifyToken, (req, res) => {
    let body = req.body,
        hospital = new Hospital({
            name: body.name,
            user: req.user._id
        });

    hospital.save((err, savedHospital) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error a guardar hospital',
                err
            });
        }

        res.status(201).json({
            ok: true,
            'Nuevo hospital': savedHospital
        });
    });
});

// ================================================
// ================= Actualizar hospital
// ================================================
app.put('/:id', mdAuthentication.verifyToken, (req, res) => {
    let id = req.params.id,
        body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'El hospital no fue encontrado',
                err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                message: `El hospital con el id ${ id } no existe`,
                err: { message: 'No existe un hospital con ese ID' }
            });
        }

        hospital.name = body.name;
        hospital.user = req.user._id;

        hospital.save((err, updatedHospital) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar hospital',
                    err
                });
            }

            res.status(200).json({
                ok: true,
                'Hospital actualizado': updatedHospital
            });
        });
    });
});

// ================================================
// ================= Eliminar hospital
// ================================================
app.delete('/:id', mdAuthentication.verifyToken, (req, res) => {
    let id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, deletedHospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar hospital',
                err
            });
        }

        if (!deletedHospital) {
            return res.status(400).json({
                ok: false,
                message: `El hospital con el id ${ id } no existe`,
                err: { message: 'No existe un hospital con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            'Hospital eliminado': deletedHospital
        });
    });
});
module.exports = app;