import { validarPassword, generarJWT } from "../helpers/index.js";
import { Usuario } from "../models/usuario.js";
import { googleVerify  } from "../helpers/index.js";


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

const googleSignIn = async(req, res)=>{
    const { id_token } = req.body;
    try {
        const googleUser = await googleVerify(id_token);
        const { nombre, correo, img } = googleUser;

        let usuario = await Usuario.findOne({correo});
        if(!usuario){
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
                rol:'USER_ROL'
            }   
            
            usuario = new Usuario(data);
            await usuario.save();   
        };

        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Comuniquese con el administrador - usuario no autorizado'
            })
        };

        const token = await generarJWT(usuario.id);

        res.json({
            msg:'¡Todo bien! sign in',
            usuario,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg:'El token no se pudo verificar',
            ok: false
        })
    }
    
};

export {
    login,
    googleSignIn
}