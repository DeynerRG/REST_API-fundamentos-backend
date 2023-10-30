import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken'
import { Usuario } from "../models/usuario.js";
import Categoria from "../models/categoria.js";

const validarCampos = ( req, res, next )=>{
   
    // funciones de express-validator
    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status( 400 ).json( errors );
    }
    next();
};



const validarJWT = async(req, res, next)=>{
    // acceso al header de la peticion el cual contiene el token de acceso
    // .header('nombre_header') devuelve el header recibido en la petición
    const token = req.header('x-token');
    
    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    };

    try {
        // Validar el jwt
        // payload es el contenido del token
        const payload = jwt.verify(token, process.env.PRIVATE_KEY_JWT );
        const { uid } = payload;

        // leer el usuario con el uid recibido en la req
        const usuario = await Usuario.findById(uid);

        // validar que exista el usuario
        if(!usuario){
            return res.status(404).json({
                msg: 'Token no valido - usuario no existe en BD'
            })
        }

        // validar que el usuario no haya sido eliminado (estado: true)
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado false'
            })
        }



        req.usuario = usuario;
        
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Token no valido'
        })
    }
    
    next(); // permite continuar al sig. middleware o controlador
};

const esAdminRole = (req, res, next)=>{
    
    const usuario = req.usuario;
    if(!usuario){
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        })
    };

    const { rol, nombre} = req.usuario;
    if(rol !== 'ADMIN_ROL'){
        return res.status(401).json({
            msg: `${nombre} no es administrador`,
        })
    }

    next()

};


// Middleware que recibe parametros en este caso no se conoce el numero de parametros se utiliza spread
const tieneRole = (...roles)=>{
    return (req, res, next)=>{

        const usuario = req.usuario;
        if(!usuario){
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            })
        };


        // verificar si existe el rol
        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg: `El servicio requiere al menos uno de los sig. roles ${roles}`
            })
        }

        next();
    }
};

const existeCategoria = async( req, res, next )=>{

    let { categoria='' } = req.body;

    
    // si no se proporciona una categoria
    if(categoria === ''){
        return res.json({
            msg: 'la categoria es obligatoria'
        })
    };

    
    try {
    
        categoria = categoria.toUpperCase();
        const existeCategoria = await Categoria.findOne({ nombre: categoria, estado: true });
        if(!existeCategoria){
            return res.status(401).json({
                msg: 'la categoria no existe'
            })
        }

        req.categoria = existeCategoria;
    
    } catch (error) {
        return res.status(500).json({
            msg: 'error en el servidor'
        })
    }


    next();
};



export {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole,
    existeCategoria
};
