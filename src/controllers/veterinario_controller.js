import veterinario from "../models/veterinario.js"
import sendMailToUser from "../config/nodemailer.js"

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
export {
    registro,
    login,
    confirmEmail
}