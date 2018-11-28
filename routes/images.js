const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.get('/:type/:img', (req, res, next) => {
    let type = req.params.type,
        img = req.params.img,
        pathImg = path.resolve(__dirname, `../files/${ type }/${ img }`),
        pathNoImg = path.resolve(__dirname, `../assets/no-img.jpg`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        res.sendFile(pathNoImg);
    }
});

module.exports = app;