import mongoose from "mongoose"
import Paciente from "../models/Paciente.js"
import {sendMailToPaciente} from '../config/nodemailer.js'


const registrarPaciente = async(req,res)=>{
    // Paso 1 - Tomar datos del request
    const {email} = req.body

    //paso 2 - Validar datos
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const verificarEmailBDD = await Paciente.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    //paso 3 - Interactuar con la BDD

    const nuevoPaciente = new Paciente(req.body)
    const password = Math.random().toString(36).slice(2)
    nuevoPaciente.password = await nuevoPaciente.encrypPassword("vet"+password)
    await sendMailToPaciente(email,"vet"+password)
    nuevoPaciente.Veterinario = req.veterinarioBDD._id
    await nuevoPaciente.save()
    res.status(200).json({msg:"Registro exitoso del paciente y correo enviado"})
}
const listarPaciente = async (req,res)=>{
    const pacientes = await Paciente.find({estado:true}).where('veterinario').equals(req.veterinarioBDD).select("-salida -createdAt -updatedAt -__v").populate('veterinario','_id nombre apellido')
    res.status(200).json(pacientes)
}
const detallePaciente = async(req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`});
    const paciente = await Paciente.findById(id).select("-createdAt -updatedAt -__v").populate('veterinario','_id nombre apellido')
    res.status(200).json(paciente)
}
const actualizarPaciente = async(req,res)=>{
    const {id} = req.params
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`});
    await Paciente.findByIdAndUpdate(req.params.id,req.body)
    res.status(200).json({msg:"Actualización exitosa del paciente"})
}
const elminarPaciente = (req, res) => {
    res.send("Paciente eliminado")
}

const loginPaciente = (req, res) => {
    res.send("Dueño inicio sesión con exito")
}
const perfilPaciente = (req, res) => {
    res.send("Dueño puede ver su perfil")
}


export {
    registrarPaciente,
    listarPaciente,
    actualizarPaciente,
    elminarPaciente,
    detallePaciente,
    loginPaciente,
    perfilPaciente
}