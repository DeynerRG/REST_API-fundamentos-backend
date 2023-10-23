import { check, checkSchema } from "express-validator";
import { getUsuarios, putUsuario, postUsuario, deleteUsuario } from "../controllers/usuariosController.js";
import { Router } from "express";
import { tieneRole, validarCampos } from "../middlewares/index.js";
import { existeEmail, validarRol, existeUsuarioPorId } from "../helpers/index.js";
import { validarJWT, esAdminRole } from "../middlewares/index.js";



const userRouter = Router();

userRouter.get('/',  getUsuarios );

// definir una ruta dinamica que toma cuyo nombre es el definido
userRouter.put('/:id', [
    check("id", "No es un id valido").isMongoId(),
    check("id").custom( (id)=>existeUsuarioPorId(id) ),
    check("rol").custom( (rol)=> validarRol(rol) ),
    validarCampos

] , putUsuario);

// Se va a ejecutar varios middlewares por lo tanto se agrega a un arreglo
userRouter.post('/', [
    check("correo", "el correo no es valido").isEmail(),
    check("nombre", "el nombre es obligatorio").not().isEmpty(),
    check("password", "el password es obligatorio y más de letras").isLength({ min: 6}),
    // Valida si el correo ya existe
    check("correo").custom( ( correo )=> existeEmail(correo) ),
    // Valida si el rol existe en la base de datos
    check("rol").custom( ( rol )=> validarRol(rol) ),
    validarCampos
] , postUsuario);


userRouter.delete('/:id',[
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROL', 'VENTAS_ROL'),
    check("id", "No es un id valido").isMongoId(),
    check("id").custom( (id)=>existeUsuarioPorId(id) ),
    validarCampos,
], deleteUsuario);




export default userRouter;
