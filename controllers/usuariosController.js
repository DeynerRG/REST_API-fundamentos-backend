import { response, request } from "express"; // para el autocompletado en el codigo pero no es necesario


const getUsuario = (req, res = response)=>{
            
    const data = {
        "msg": "get api controller"
    }
    res.json( data );
};


const putUsuario =  (req, res = response)=>{
    
    // req.params obtiene el objeto de parametros del request
    const { id } = req.params
    
    const { nombre, email} = req.body;
    const data = {
        "msg": "put api controller",
        nombre,
        email,
        id
    }
    res.status( 200 ).json( data );
};


const postUsuario = (req, res = response)=>{
    
    // los query params se pueden enviar opcionalmente 
    // por lo tanto no es necesario definir una ruta dinamica para eso.
    const querys = req.query;
    const { nombre = 'no name', apikey, page } = querys;
    
    const data = {
        "msg": "post api controller",
        nombre,
        apikey,
        page
    }
    res.status( 201 ).json( data );
};


const deleteUsuario = (req, res = response)=>{
    
    const querys = req.query;
    const { id } = querys;
    const data = {
        "msg": "delete api controller",
        id
        
    }
    res.json( data );
};

export {
    getUsuario,
    putUsuario,
    postUsuario,
    deleteUsuario
}