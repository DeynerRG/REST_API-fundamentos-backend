import { Router } from "express";
import { check } from "express-validator";
import { 
    obtenerCategorias, 
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
} from "../controllers/categoriasController.js";
import { esAdminRole, validarCampos, validarJWT } from "../middlewares/index.js";
import { existeCategoriaPorId} from "../helpers/index.js";


const categoriasRouter = Router();

categoriasRouter.get('/', obtenerCategorias);

// middleware custom
categoriasRouter.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( (id) => existeCategoriaPorId(id) ),
    validarCampos,
], obtenerCategoriaPorId);

// privado con token
categoriasRouter.post('/', [
    validarJWT,
    check('nombre', 'el nombre es obligatorio').not().isEmpty(),
    validarCampos,
] , crearCategoria);

// privado con token
categoriasRouter.put('/:id',[
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( (id)=> existeCategoriaPorId(id)),
    check('nombre', 'no proporciono un nombre para la categoria').not().isEmpty(),
    validarCampos,
], actualizarCategoria)

categoriasRouter.delete('/:id',[
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom((id)=> existeCategoriaPorId(id)),
    esAdminRole,
    validarCampos
] , eliminarCategoria)

export default categoriasRouter;

