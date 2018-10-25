var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var medicSchema = new Schema({
    name: { type: String, required: [true, 'El campo nombre es obligatorio'] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El Id del hospital es obligatorio'] }
});

module.exports = mongoose.model('medic', medicSchema);