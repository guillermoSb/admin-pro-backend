const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    }
}); // Crear usuarios


// Cambiar id a uid
UsuarioSchema.method('toJSON', function() {
   const {__v, _id, password, ...object} = this.toObject(); 

   object.uid = _id;
   return object;
});

// Implementar el modelo
module.exports = model('Usuario', UsuarioSchema);

