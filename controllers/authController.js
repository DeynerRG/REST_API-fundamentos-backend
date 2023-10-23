import { validarPassword, generarJWT } from "../helpers/index.js";
import { Usuario } from "../models/usuario.js";

const login = async(req, res)=>{
    
    const { correo, password } = req.body;
    
    try {
    
        const usuario = await Usuario.findOne({correo}); 
        // Verificar si existe el email en la bd
        if(!usuario){
            return res.json({ msg: `Usuario / Password:  no son correctos - correo`})
        };
        // Verificar si el usuario esta activo
        if(!usuario.estado){
            return res.json({ msg: `Usuario / Password:  no son correctos - estado`})
        };
        // Verificar la contraseña
        const validPassword = validarPassword(password, usuario.password)
        if(!validPassword){
            return res.json({msg: `Usuario / Password:  no son correctos - password`})
        }
        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });

    } catch (error) {
    
        console.log(error)
        return res.status(500).json({
            msg: "Algo salio mal"
        })
    
    };
};




export {
    login
}