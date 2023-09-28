import express, { Router } from 'express';
import cors from 'cors';
import userRouter from '../routes/usuariosRoute.js';

class Server{

    constructor(){
        
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        // Middlewares
        this.middlewares();
        // Rutas de la aplicacion
        this.routes();

    }

    middlewares(){

        // CORS
        this.app.use(cors());

        // Parseo y lectura del body en formato json
        this.app.use( express.json() );
 
        // Directorio publico
        this.app.use(express.static('public'));
    };


    routes(){
        
       this.app.use(this.usuariosPath, userRouter)

    };

    listen(){
        
        this.app.listen( this.port, ()=>{
            console.log(`Servidor corriendo en puerto ${this.port}`);
        });
    };


};

export default Server;