import express, { Router } from 'express';
import cors from 'cors';
import userRouter from '../routes/usuariosRoute.js';
import authRouter from '../routes/authRoute.js';
import { dbConection } from '../database/config.js';

class Server{

    constructor(){
        
        this.app = express();
        this.port = process.env.PORT || 8080;
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';

        // Conectar a la base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();
        // Rutas de la aplicacion
        this.routes();

    }

    async conectarDB(){
        await dbConection();
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
        
       this.app.use(this.usuariosPath, userRouter);
       this.app.use(this.authPath, authRouter);

    };

    listen(){
        
        this.app.listen( this.port, ()=>{
            console.log(`Servidor corriendo en puerto ${this.port}`);
        });
    };


};

export default Server;
