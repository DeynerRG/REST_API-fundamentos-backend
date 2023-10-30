import { json } from "express";
import Categoria from "../models/categoria.js";
import mongoose from "mongoose";


// paginado - total - populate 
const obtenerCategorias = async( req, res )=>{
    
    const { limite = 20, desde = 0} = req.query;


    const resp = await Promise.all([
        Categoria.find({estado: true}).limit(Number(limite)).skip(Number(desde)).populate('usuario'),
        Categoria.countDocuments({estado: true})
    ])
    const [ total, usuarios ] = resp;
    
    res.json({ 
        total, 
        usuarios,
        msg:'obtener categorias'
    })
};

// populate
const obtenerCategoriaPorId = async( req, res )=>{
    const { id } = req.params
    try {
        const categoria = await Categoria.find({ _id: id, estado: true}).populate('usuario');
        res.json(categoria);
    } catch (error) {
        console.log(error);
        res.json({
            msg:'error en el servidor',        
        })
        
    }
   
   
};


const crearCategoria = async( req, res )=>{

    const usuario = req.usuario;
    const nombre = req.body.nombre.toUpperCase(); // convierte el nombre de la cat. a may. 

    // validar si ya existe la categoria
    const categoriaDB = await Categoria.findOne({nombre});
    if(categoriaDB){
        return res.json({
            msg: `La categoria ${ req.body.nombre } ya existe en la base de datos`
        })
    }

    // si la categoria no existe en la db entonces se almacena la nueva categoria
    const nuevaCategoria = {
        nombre,
        usuario: usuario._id
    }

    try {

        const categoria = new Categoria(nuevaCategoria);
        await categoria.save();
        return res.status(201).json({
            msg: 'categoria creada correctamente',
            categoria
        })

    } catch (error) {
        
        res.json({
            msg: 'no se pudo crear la categoria'
        })
    }
};



const actualizarCategoria = async( req, res )=>{
    const id = req.params.id;
    const { nombre } = req.body;
    

    try {
        const categoriaActualizada = await Categoria.findByIdAndUpdate(id, { nombre: nombre.toUpperCase()}, { new: true}).populate('usuario', 'nombre img correo rol');
        res.json({
            msg:'ok',
            categoriaActualizada
        })
    } catch (error) {
        console.log(error);
    }
};


const eliminarCategoria = async( req, res )=>{
    
    try {
        
        const { id } = req.params;
        const categoriaEliminada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true })
        res.json({
            msg:'categoria eliminada correctamente',
            categoriaEliminada

        })

    } catch (error) {
        console.log(error);
        res.json({msg:'error al intentar eliminar la categoria'})
    }
    
    
};


export {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
}