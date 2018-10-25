const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const roleValidator = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: 'El rol \'{VALUE}\' no es valido'
};

const userSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es obligatorio'] },
    password: { type: String, required: [true, 'La contraseña es obligatorio'], },
    email: { type: String, required: [true, 'El email es obligatorio'], unique: true },
    img: { type: String, required: false },
    role: { type: String, required: [true, 'El rol es obligatorio'], default: 'USER_ROLE', enum: roleValidator },
});

userSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser unico' });

module.exports = mongoose.model('User', userSchema);