import { response, request } from "express"; // para el autocompletado en el codigo pero no es necesario
import { Usuario } from "../models/usuario.js";
import { hashPassword } from "../helpers/index.js";


const getUsuarios = async(req, res = response)=>{
    
    // limit devuelve el numero de registros a devolver.
    // skip especifica la posicion en la que inicia a leer los registros
    const { limite = 5, desde = 0 } = req.query;

    // Promise.all espera a que todas las promesas terminen para devolver un resultado
    const resp = await Promise.all([
        Usuario.countDocuments({ estado: true }),
        Usuario.find({ estado: true }).limit( Number(limite) ).skip( Number(desde) )
    ])
    // desestructuro el resultado de las promesas
    const [ total, usuarios] = resp;
    
    res.json({
        total,
        usuarios
        
    });

};


const putUsuario =  async(req, res = response)=>{
    
    // req.params obtiene el objeto de parametros del request
    const { id } = req.params
    const { _id, password, google, correo, ...resto } = req.body;
    
    // validar contra base de datos
    if( password ){
        // recibe el password lo hashea y lo agrega al objeto 'resto'
        resto.password = hashPassword( password );
    }

    // Actualiza el usuario mediante el id y le pasa el objeto con los cambios
    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true});
    
    res.status( 200 ).json( usuario );

};


const postUsuario = async(req, res = response)=>{

    const { nombre, correo, password, rol } = req.body;
    const body = req.body;
    const usuario = new Usuario({
        nombre,
        correo,
        password,
        rol
    });



    // Encriptar el password
    usuario.password  = hashPassword( usuario.password );
    
    // Guardar en la  bd
    await usuario.save();
    const data = {
        "msg": "post api controller",
        usuario
    }
    res.status( 201 ).json( data );
};


const deleteUsuario = async(req, res = response)=>{
    
    const { id } = req.params;
    const usuarioAutenticado = req.usuario;

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false}, { new: true});
    
    res.json( {usuario, usuarioAutenticado} );
};

export {
    getUsuarios,
    putUsuario,
    postUsuario,
    deleteUsuario
}