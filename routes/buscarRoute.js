import { buscar } from "../controllers/buscarController.js";
import { Router } from "express";

const buscarRouter = Router();

buscarRouter.get( '/:coleccion/:termino', buscar )

export default buscarRouter;