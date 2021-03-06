const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

// ================================================
// ================= Verificar token
// ================================================
exports.verifyToken = function(req, res, next) {
    let token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Error al validar token',
                err: err
            });
        }

        req.user = decoded.user;

        next();
    });
};