import express, { Router } from 'express';
import cors from 'cors';
import userRouter from '../routes/usuariosRoute.js';
import authRouter from '../routes/authRoute.js';
import categoriasRouter from '../routes/categoriasRoute.js';
import productoRouter from '../routes/productosRoute.js';
import buscarRouter from '../routes/buscarRoute.js';
import { dbConection } from '../database/config.js';




class Server{

    constructor(){
        
        this.app = express();
        this.port = process.env.PORT || 8080;
        // forma 1: definir una variable para almacenar cada ruta
        // this.usuariosPath = '/api/usuarios';
        // this.authPath = '/api/auth';
        // this.categoriasPath = '/api/categorias';
        // forma 2: definir una variable para almacenar todas las rutas
        this.paths = {
            auth:       '/api/auth',
            categorias: '/api/categorias',
            usuarios:   '/api/usuarios',
            productos:  '/api/productos',
            buscar:     '/api/buscar'
        }

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
        
        // forma 1: con variables de ruta por separado
        //    this.app.use(this.usuariosPath, userRouter);
        //    this.app.use(this.authPath, authRouter);
        //    this.app.use(this.categoriasPath, categoriasRouter);
        
        // forma 2: con una sola variable (object) que almacena todas las rutas
        this.app.use( this.paths.usuarios, userRouter );
        this.app.use( this.paths.auth, authRouter );
        this.app.use( this.paths.categorias, categoriasRouter );
        this.app.use( this.paths.productos, productoRouter );
        this.app.use( this.paths.buscar, buscarRouter);

    };

    listen(){
        
        this.app.listen( this.port, ()=>{
            console.log(`Servidor corriendo en puerto ${this.port}`);
        });
    };


};

export default Server;
