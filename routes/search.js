const express = require('express');
const mongoose = require('mongoose');

// Models
const Hospital = require('../models/hospital');
const Medic = require('../models/medic');
const User = require('../models/user');

const app = express();

//===============================================
//------------- Busqueda de usuarios
//===============================================
app.get('/collection/:table/:search', (req, res) => {
    let table = req.params.table,
        search = req.params.search,
        regexp = new RegExp(search, 'i'),
        promExec;

    switch (table) {
        case 'users':
            promExec = searchUsers(regexp);
            break;
        case 'hospitals':
            promExec = searchHospitals(regexp);
            break;
        case 'medics':
            promExec = searchMedics(regexp);
            break;
        default:
            return res.status(400).json({
                ok: true,
                message: 'Los tipos de búsqueda solo son: Usuarios, Medicos y Hospitales',
                err: 'Parametro tabla no es valido'
            })
            break;
    }

    promExec
        .then(result => {
            res.status(200).json({
                ok: true,
                [table]: result
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
    let search = req.params.search,
        regexp = new RegExp(search, 'i');

    Promise.all([
            searchHospitals(regexp),
            searchMedics(regexp),
            searchUsers(regexp)
        ])
        .then(result => {
            res.status(200).json({
                ok: true,
                hospitales: result[0],
                medicos: result[1],
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

function searchMedics(regexp) {
    return new Promise((resolve, reject) => {
        Medic.find({ name: regexp })
            .limit(5)
            .populate('user', 'name email role')
            .populate('hospital')
            .exec((err, medics) => {
                if (err) {
                    reject('Error al consultar medicos', err);
                } else {
                    resolve(medics);
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