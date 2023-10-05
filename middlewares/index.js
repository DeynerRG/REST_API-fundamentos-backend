import { validationResult } from "express-validator";


const validarCampos = ( req, res, next )=>{
   
    // funciones de express-validator
    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status( 400 ).json( errors );
    }
    next();
};





export {
    validarCampos
};
