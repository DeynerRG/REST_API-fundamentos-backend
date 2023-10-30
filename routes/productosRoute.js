import { Router } from "express";
import { 
    obtenerProductos,
    obtenerProductosPorId,
    agregarProducto,
    actualizarProducto,
    eliminarProducto
} from "../controllers/productosController.js";
import { esAdminRole, existeCategoria, validarCampos, validarJWT } from "../middlewares/index.js";
import { check } from "express-validator";
import { existeCategoriaPorId, existeProducto, existeProductoPorId } from "../helpers/index.js";


const productoRouter = Router();


productoRouter.get('/', obtenerProductos);

productoRouter.get('/:id',[
    check('id','no es un id valido').isMongoId(),
    validarCampos,
], obtenerProductosPorId);

productoRouter.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('descripcion', 'Proporcione una descripción').not().isEmpty(),
    check('nombre').custom((nombre)=> existeProducto(nombre)),
    existeCategoria,    
    validarCampos
], agregarProducto);

productoRouter.put('/:id',[
    validarJWT,
    // check('categoria', 'No es un id valido').isMongoId(),
    check('id').custom((id)=> existeProductoPorId(id)),
    // check('categoria').custom((categoria)=> existeCategoriaPorId(categoria)),
    validarCampos,   
], actualizarProducto);

productoRouter.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo válido').isMongoId(),
    check('id').custom((id)=> existeProductoPorId(id)),
    validarCampos,
], eliminarProducto);

export default productoRouter;