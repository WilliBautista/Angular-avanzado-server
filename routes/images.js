const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.get('/:type/:img', (req, res, next) => {
    let type = req.params.type,
        img = req.params.img,
        pathImg = path.resolve( __dirname, `../files/${ type }/${ img }` );

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    }

    res.status(400).json({
        ok: true,
        message: 'Petición realizada correctamente',
        exist
    });
});

module.exports = app;
