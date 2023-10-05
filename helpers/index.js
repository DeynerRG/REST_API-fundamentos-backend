import bycriptjs from 'bcryptjs';
import Role from "../models/rol.js";
import { Usuario } from '../models/usuario.js';

const hashPassword = ( password )=>{

    const salt = bycriptjs.genSaltSync(10);
    const passwordHashed = bycriptjs.hashSync( password, salt  );
    return passwordHashed;

};


const validarRol = async( rol = '' ) => {
    
    const existeRol = await Role.findOne( { rol } );
    if( !existeRol ){
        throw new Error(`El rol ${ rol } no existe en la base de datos`); // este error lo atrapa express validator
    };

};

const existeEmail = async( correo = '')=>{
    
    const existeEmail = await Usuario.findOne({ correo });
    if( existeEmail ){
        throw new Error(`Ya existe un usuario con ${correo}`)
    }
    
};


const existeUsuarioPorId = async( id )=>{
    
    const existeUsuario = await Usuario.findById(id);
    if( !existeUsuario ){
        throw new Error(`El id no existe`)
    }
    
};





export {
    hashPassword,
    validarRol,
    existeEmail,
    existeUsuarioPorId
}