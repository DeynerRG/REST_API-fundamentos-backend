import { getUsuario, putUsuario, postUsuario, deleteUsuario } from "../controllers/usuariosController.js";
import { Router } from "express";

const userRouter = Router();

userRouter.get('/',  getUsuario );

// definir una ruta dinamica que toma cuyo nombre es el definido
userRouter.put('/:id', putUsuario);


userRouter.post('/', postUsuario);


userRouter.delete('/', deleteUsuario);


export default userRouter;
