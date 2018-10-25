var express = require('express');
var fileUpload = require('express-fileupload');

var app = express();

// default options
app.use(fileUpload());

app.post('/', (req, res) => {

    var files = req.files;

    if (!files) {
        return res.status(400).json({
            ok: false,
            message: 'No ha seleccionado ninguna imagen',
            err: { message: 'Por favor seleccione una imagen' }
        });
    }

    // Nombre de imagen y  extension
    var file = files.image,
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


    res.status(200).json({
        ok: true,
        message: 'Petición realizada correctamente',
        extensionFile
    });
});

module.exports = app;