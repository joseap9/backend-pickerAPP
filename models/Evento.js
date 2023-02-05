const { Schema, model } = require('mongoose');

const EventoSchema = Schema({ 
    
    tienda: {
        type: String,
    },
    op: {
        type: Number,
    },
    fecha_facturacion: {
        type: Date
    },
    sku_solicitado: {
        type: Number
    },
    iduser: {
        type: String
    },
    nombre: {
        type: String,
    },
    rut: {
        type: String,
    },

});

EventoSchema.method('toJSON', function() {
    const {__v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('picker', EventoSchema);