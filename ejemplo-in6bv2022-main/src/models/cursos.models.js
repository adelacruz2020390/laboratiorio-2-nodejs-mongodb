const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CursosSchema = Schema({
    nombre: String,
    descripcion: String,
    idCreadorCurso: { type: Schema.Types.ObjectId, ref: 'Usuarios'}
});

module.exports = mongoose.model('cursos', CursosSchema);