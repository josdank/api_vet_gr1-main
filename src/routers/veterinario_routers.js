import { Router } from "express";
import { confirmEmail, registro } from "../controllers/veterinario_controller.js";
const router = Router()

router.post('/registro', registro)

router.get('/confirmar/:token', confirmEmail)



export default router