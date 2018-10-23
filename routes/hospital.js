var express = require('express');
var Hospital = require('../models/hospital');
var mdAuthentication = require('../middleware/authentication');

var app = express();

// ================================================
// ================= Obtener hospitales
// ================================================

app.get('/', (req, res) => {
    Hospital.find({}, )
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

            res.status(200).json({
                ok: true,
                hospitals
            });
        });
});

// ================================================
// ================= Crear hospital
// ================================================
app.post('/', mdAuthentication.verifyToken, (req, res) => {
    var body = req.body,
        hospital = new Hospital({
            name: body.name,
            img: body.img,
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

        res.status(200).json({
            ok: true,
            'Nuevo hospital': savedHospital
        });
    });
});

// ================================================
// ================= Actualizar hospital
// ================================================
app.put('/:id', mdAuthentication.verifyToken, (req, res) => {
    var id = req.params.id,
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
        hospital.img = body.img;

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
    var id = req.params.id;

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