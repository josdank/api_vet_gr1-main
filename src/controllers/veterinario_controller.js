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
    res.status(200).json(nuevoVeterinario)
    
}

export {
    registro
}