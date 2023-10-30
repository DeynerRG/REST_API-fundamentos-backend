import { model, Schema } from "mongoose";

const categoriaSchema = Schema({

    nombre:{
        type: String,
        required: [true, 'El nombre de la categoria es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
    
});

const Categoria = model( 'Categoria', categoriaSchema );
export default Categoria;