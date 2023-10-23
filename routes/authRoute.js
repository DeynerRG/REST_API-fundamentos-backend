import { Router } from "express";
import { check } from "express-validator";
import { login } from "../controllers/authController.js";
import { validarCampos } from "../middlewares/index.js";

const authRouter = Router();

authRouter.post('/login', [
    check('correo', 'el correo es obligatorio').isEmail(),
    check('password', 'la contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);



export default authRouter;