import veterinario from "../models/veterinario.js"
import { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js"
import veterinario from "../models/veterinario.js"
import {generarJWT} from "../helpers/crearJWT.js"

const registro = async (req, res) => {
    const {email, password} = req.body
    
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"lo sentimos debes llenar todo los campos"})
    
    const verificarEmail = await veterinario.findOne({email})
    if (verificarEmail) return res.status(400).json({msg:"lo sentimos este email ya esta registrado"})

    // Iteractuar con la BDD
    const nuevoVeterinario = new veterinario(req.body)
    nuevoVeterinario.password = await nuevoVeterinario.encrypPassword(password)
    const token = nuevoVeterinario.crearToken()
    await sendMailToUser(email, token)
    await nuevoVeterinario.save()
    res.status(200).json({msg:"Revisa tu correo para confirmar tu cuenta"})
}

const confirmEmail = async (req, res) => {
    //paso 1 - Tomar datos del request
    const {token} = req.params
    // paso 2 - Validar datos
    if(!(token)) return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    const veterinarioBDD = await veterinario.findOne({token})
    if(!veterinarioBDD?.token) return res.status(404).json({msg:"La cuenta ya ha sido confirmada"})
    // paso 3 - interactuar con la bdd
    veterinarioBDD.token = null
    veterinarioBDD.confirmEmail=true
    veterinarioBDD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"}) 
}

const login = async (req, res) => {
    //paso 1 - Tomar datos del request
    const {email, password} = req.body
    // paso 2 - Validar datos
    if(Object.values(req.body).includes(""))return res.status(400).json({msg:'Lo sentimos debes llenar todos los campos'})

    const veterinarioBDD = await veterinario.findOne({email})
    if (veterinarioBDD?.confirmEmail===false) return res.status(400).json({msg:'Lo sentimos debes validar tu cuenta'})

    if(!veterinarioBDD) return res.status(400).json({msg:'Lo sentimos el email no se encuentra registrado'})
    const verificarPassword = await  veterinarioBDD.matchPassword(password)
    if (!verificarPassword) return res.status(400).json({msg:'Lo sentimos el password no es el correcto'})

    // paso 3 - interactuar con la bdd
    res.status(200).json(veterinarioBDD)
}
const recuperarPassword = async(req,res)=>{
    const {email} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    
        const veterinarioBDD = await Veterinario.findOne({email})
    if(!veterinarioBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    
    const token = veterinarioBDD.crearToken()
    veterinarioBDD.token=token
    await sendMailToRecoveryPassword(email,token)
    await veterinarioBDD.save()
    res.status(200).json({msg:"Revisa tu correo electrónico para reestablecer tu cuenta"})
}

const tokenPassRecover = async(req,res) => {
    const {token} = req.params
    if (!(token)) return res.status(400).json({msg:"Lo sentimos no se puede validar su cuenta"})
    
    const veterinarioBDD = await Veterinario.findOne({token})
    if(veterinarioBDD?.token !== token) res.status(400).json({msg:"Lo sentimos, no se puede validar su token"})
    
    await veterinarioBDD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
}

const newPassword = async(req,res) => {
    const {password, confirmPassword} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    
    if (password != confirmPassword) return res.status(404).json({msg:"Las contraseñas no coinciden"})
    const veterinarioBDD = await Veterinario.findOne({token:req.params.token})
    if(veterinarioBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})

    veterinarioBDD.token = null
    veterinarioBDD.password = await veterinarioBDD.encrypPassword(password)
    await veterinarioBDD.save()
    res.status(200).json({msg:"Contraseña cambiada exitosamente"})
}

const perfilUser = (req, res) => {
  res.send("Perfil del usuario")
}

const actualizarPerfil = (req,res) => {
  
}

const actualizarPassword = async (req, res) => {
    const {password, confirmPassword} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    
    if (password != confirmPassword) return res.status(404).json({msg:"Las contraseñas no coinciden"})
    const veterinarioBDD = await Veterinario.findOne({token:req.params.token})
  
    veterinarioBDD.password = await veterinarioBDD.encrypPassword(password)
    await veterinarioBDD.save()
    res.status(200).json({msg:"Contraseña cambiada exitosamente"})
}
export {
    registro,
    login,
    confirmEmail,
    recuperarPassword,
    tokenPassRecover,
    newPassword,
    perfilUser,
    actualizarPerfil,
    actualizarPassword
}