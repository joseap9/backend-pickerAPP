const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({ 

    rut: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    }


});

module.exports = model('Usuario', UsuarioSchema);