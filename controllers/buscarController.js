import { response } from "express";
import mongoose from "mongoose";
import { Usuario } from "../models/usuario.js";
import Categoria from "../models/categoria.js";
import Producto from "../models/producto.js";

const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'productos',
    'roles'
];

const buscarUsuarios = async( termino='', res=response )=>{

    const esMongoID = mongoose.Types.ObjectId.isValid(termino);
    if(esMongoID){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: usuario ? [ usuario ] : []
        })
    }


    const regex = new RegExp(termino, 'i')
    const usuarios = await Usuario.find({
        $or:[{nombre: regex}, { correo: regex }],
        $and: [{estado: true}]
    });
    res.json({
        results: usuarios 
    })

};


const buscarCategorias = async(termino='', res=response)=>{

    const esMongoID = mongoose.Types.ObjectId.isValid(termino);
    if(esMongoID){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: categoria ? categoria : null
        })
    };

    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({
        $and: [ { nombre: regex }, { estado: true } ]
    })
    res.json({
        results: categorias
    })

};

const buscarProducto = async(termino='', res=response) =>{
    
    const esMongoID = mongoose.Types.ObjectId.isValid(termino);
    if(esMongoID){
        const producto = await Producto.findById(termino);
        return res.json({
            results: producto ? producto : null
        })
    };

    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({
        $and: [ { nombre: regex }, { estado: true } ]
    })
    res.json({
        results: productos
    })
}

const buscar = async(req, res)=>{

    const { coleccion, termino } = req.params;

    if( !coleccionesPermitidas.includes(coleccion) ){
        return res.status(400).json({
            msg: `las colecciones permitadas son: ${coleccionesPermitidas}`
        })
    };
    
    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categoria':
            buscarCategorias(termino, res)
            break;
        case 'productos':
            buscarProducto(termino, res)
            break;
    
        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta busqueda'
            });
    };


};

export {
    buscar
}