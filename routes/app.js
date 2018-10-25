const express = require('express');

const app = express();

app.get('/', (req, res, next) => {
    res.status(400).json({
        ok: true,
        message: 'Petición realizada correctamente'
    });
});

module.exports = app;
