import Router from 'express';
import { actualizarPaciente, detallePaciente, elminarPaciente, listarPaciente, loginPaciente, perfilPaciente, registrarPaciente } from '../controllers/paciente_controller.js';
import verificarAutenticacion from '../middleware/autenticacion.js';


const router = Router()

router.post('/paciente/registro',verificarAutenticacion, registrarPaciente)
router.get('/pacientes',verificarAutenticacion, listarPaciente)
router.get('/paciente/:id',verificarAutenticacion, detallePaciente)
router.put('/paciente/actualizar/:id',verificarAutenticacion, actualizarPaciente)
router.delete('/paciente/eliminar/:id',verificarAutenticacion, elminarPaciente)

router.post('/paciente/login', loginPaciente)
router.post('/paciente/perfil',verificarAutenticacion, perfilPaciente)


export default router