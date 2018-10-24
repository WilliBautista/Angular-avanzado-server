var express = require('express');
var mongoose = require('mongoose');

// Models
var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');

app = express();

//===============================================
//------------- Busqueda de usuarios
//===============================================
app.get('/user/:user', (req, res) => {
    var user = req.params.user,
        regexp = new RegExp(user, 'i');

    searchUsers(regexp)
        .then( users => {
            res.status(200).json({
                ok: true,
                users
            });
        })
        .catch(err => {
            res.status(400).json({
                ok: true,
                err
            });
        });
});

//===============================================
//------------- Busqueda de hospitales
//===============================================
app.get('/hospital/:hospital', (req, res) => {
    var hospital = req.params.hospital,
        regexp = new RegExp(hospital, 'i');

    searchHospitals(regexp)
        .then( hospitals => {
            res.status(200).json({
                ok: true,
                hospitals
            });
        })
        .catch(err => {
            res.status(400).json({
                ok: true,
                err
            });
        });
});

//===============================================
//------------- Busqueda de medicos
//===============================================
app.get('/doctor/:doctor', (req, res) => {
    var doctor = req.params.doctor,
        regexp = new RegExp(doctor, 'i');

    searchDoctors(regexp)
        .then( doctors => {
            res.status(200).json({
                ok: true,
                doctors
            });
        })
        .catch(err => {
            res.status(400).json({
                ok: true,
                err
            });
        });
});

//===============================================
//------------- Busqueda global
//===============================================
app.get('/all/:search', (req, res) => {
    var search = req.params.search,
        regexp = new RegExp(search, 'i');

    Promise.all([
                searchHospitals(regexp),
                searchDoctors(regexp),
                searchUsers(regexp)
            ])
            .then( result => {
                res.status(200).json({
                    ok: true,
                    hospitales: result[0],
                    doctores: result[1],
                    usarios: result[2]
                });
            });
});

function searchHospitals(regexp) {
    return new Promise((resolve, reject) => {
        Hospital.find({ name: regexp })
            .limit(5)
            .populate('user', 'name email role')
            .exec((err, hospitals) => {
                if (err) {
                    reject('Error al consultar hospitales', err);
                } else {
                    resolve(hospitals);
                }
            });
    });
}

function searchDoctors(regexp) {
    return new Promise((resolve, reject) => {
        Doctor.find({ name: regexp })
            .limit(5)
            .populate('user', 'name email role')
            .populate('hospital')
            .exec((err, doctors) => {
                if (err) {
                    reject('Error al consultar medicos', err);
                } else {
                    resolve(doctors);
                }
            });
    });
}

function searchUsers(regexp) {
    return new Promise((resolve, reject) => {
        User.find({}, 'name email role')
            .limit(5)
            .or([{ name: regexp }, { email: regexp }])
            .exec((err, users) => {
                if (err) {
                    reject('Error al consultar usuarios', err);
                } else {
                    resolve(users);
                }
        })
    });
}

module.exports = app;
