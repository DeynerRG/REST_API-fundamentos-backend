import Producto from "../models/producto.js";

const obtenerProductos =  async(req, res)=>{

    const { limite = 20, desde = 0} = req.query;


    const resp = await Promise.all([
        Producto.find({estado: true}).limit(Number(limite)).skip(Number(desde)).populate('usuario').populate('categoria'),
        Producto.countDocuments({estado: true})
    ])
    const [ total, productos ] = resp;
    
    res.json({ 
        total, 
        productos,
        msg:'obtener productos'
    })


};

const obtenerProductosPorId = async(req, res)=>{
    
    const { id } = req.params;
    try {
        const producto = await Producto.find({ _id: id, estado: true}).populate('usuario').populate('categoria');
        res.json(producto);
    } catch (error) {
        console.log(error);
        res.json({
            msg:'error en el servidor',        
        })
        
    }
   
};

const agregarProducto = async(req, res)=>{
    
    const { nombre, descripcion } = req.body;
    const { usuario, categoria } = req;

    const data = {
        nombre,
        descripcion,
        usuario: usuario._id,
        categoria: categoria._id,
    }
    
    try {
        
        const productoDB = new Producto(data);
        await productoDB.save();

        res.json({
            msg: 'producto agregado',
            producto: productoDB
        })

    } catch (error) {
            
        console.log(error);
        res.json({
            msg: 'no se pudo crear el producto',
        })
    }
    

};

const actualizarProducto =  async(req, res)=>{
    const id = req.params.id;
    const { estado, usuario, ...data } = req.body;
    
    data.usuario = req.usuario._id;
    try {
        const productoActualizado = await Producto.findByIdAndUpdate(id, data, { new: true});
        res.json({
            msg:'ok',
            productoActualizado
        })
    } catch (error) {
        console.log(error);
    }



};

const eliminarProducto = async(req, res)=>{

    try {
        
        const { id } = req.params;
        const productoEliminado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true })
        res.json({
            msg:'producto eliminado correctamente',
            productoEliminado
        })

    } catch (error) {
        console.log(error);
        res.json({msg:'error al intentar eliminar el producto'})
    }
};

export {
    obtenerProductos,
    obtenerProductosPorId,
    agregarProducto,
    actualizarProducto,
    eliminarProducto
}
