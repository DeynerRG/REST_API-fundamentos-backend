import bycriptjs from 'bcryptjs';
import Role from "../models/rol.js";
import { Usuario } from '../models/usuario.js';
import jwt from 'jsonwebtoken';

const hashPassword = ( password )=>{

    const salt = bycriptjs.genSaltSync(10);
    const passwordHashed = bycriptjs.hashSync( password, salt  );
    return passwordHashed;

};

const validarPassword = (passwordLogin, passwordDb)=>{
    // el passwordLogin automaticamente es hasheado por bycript 
    // para comparar con  el password que si esta hasheado
    return bycriptjs.compareSync( passwordLogin, passwordDb );
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


const generarJWT = ( uid = '' )=>{

    return new Promise( ( resolve, reject )=>{
        
        const payload = { uid };
        const privateKey = process.env.PRIVATE_KEY_JWT;
        const options = {
            expiresIn: '4h'
        };
        const callback = (error, token)=>{
            if( error ) reject()
            else resolve(token);
        }

        jwt.sign( payload, privateKey, options, callback);
    });
};



export {
    hashPassword,
    validarRol,
    existeEmail,
    existeUsuarioPorId,
    validarPassword,
    generarJWT
}