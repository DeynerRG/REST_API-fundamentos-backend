import { Schema, model } from "mongoose";


const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required:[ true, 'El nombre es obligatorio' ],
    },
    correo: {
        type: String,
        required:[ true, 'El correo es obligatorio' ],
        unique: true
    },
    password: {
        type: String,
        required:[ true, 'La contraseña es obligatoria' ],
    },
    rol: {
        type: String,
        required: true,
    
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});

// En los modelos es posible crear metodos
UsuarioSchema.methods.toJSON = function(){
    const { __v, password, ...usuario} = this.toObject();
    return usuario;
};

const Usuario = model( 'Usuario', UsuarioSchema );

export {
    Usuario
};