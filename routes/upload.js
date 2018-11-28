const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const User = require('../models/user');
const Hospital = require('../models/hospital');
const Medic = require('../models/medic');

const app = express();

// default options
app.use(fileUpload());

app.post('/:table/:id', (req, res) => {

    let files = req.files,
        table = req.params.table,
        id = req.params.id,
        collectionPermitted = ['user', 'hospital', 'medic'];
    
    // Collecciones permitidas
    if (collectionPermitted.indexOf(table) < 1) {
        return res.status(500).json({
            ok: false,
            message: 'El tipo de usuario ' + table + ' no es permitido',
            err: { message: 'Usuarios permitidos: ' + collectionPermitted }
        });
    }

    if (!files) {
        return res.status(400).json({
            ok: false,
            message: 'No ha seleccionado ninguna imagen',
            err: { message: 'Por favor seleccione una imagen' }
        });
    }

    // Nombre de imagen y  extension
    let file = files.image,
        splitFile = file.name.split('.'),
        extensionFile = splitFile[splitFile.length - 1],
        formatFilePermitted = ['png', 'gif', 'jpg', 'jpeg'];

    if (formatFilePermitted.indexOf(extensionFile) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'El archivo seleccionado no es una imagen',
            err: { message: 'Por favor seleccione un archivo con una de las siguientes extensiones: ' + formatFilePermitted.join(', ') }
        });
    }

    // Crear nombre (user._id + random(3) + extesion)
    let milliseconds = new Date().getMilliseconds(),
        random = Math.floor(Math.random() * 300),
        nameFile = `${ id }-${ new Date().getMilliseconds() }${ random }.${ extensionFile }`,
        path = `./files/${ table }/${ nameFile }`;

    file.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al subir el archivo',
                err
            });
        }

        removeFile(table, id, path, res);

    });
    
});

function removeFile(table, id, path, res) {
    let collection;

    switch (table) {
        case 'user':
            collection = User;
            break;
        case 'hospital':
            collection = Hospital;
            break;
        case 'medic':
            collection = Medic;
            break;
    }

    collection.findById(id, (err, collect) => {

        if (!collect) {
            if ( fs.existsSync(path) ) {
                fs.unlink(path);
            }

            return res.status(400).json({
                ok: false,
                message: 'El usuario no existe',
                err: { message: 'Por favor verifique el id del ' + table }
            });
        }
        
        let oldPath = collect.img;
        
        if ( fs.existsSync(oldPath) ) {
            fs.unlink(oldPath);
        }
        
        
        collect.img = path;

        collect.save((err, img) => {
            collect.password = ':)';

            res.status(200).json({
                ok: true,
                message: 'El archivo se ha subido correctamente',
                [table]: collect
            });
        });
    }); 
}

module.exports = app;