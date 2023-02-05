const { response } = require('express');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require("../models/Usuario");

const loginUsuario = async(req, res = response ) => {

    
    const { rut, password } = req.body 
    try {

        let usuario = await Usuario.findOne({ rut });

        // si el rut existe
        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: "usuario no existente",
                rut
            });
        }

        //si la contraseña es correcta
        if ( password !== usuario.password ) {
            return res.status(400).json({
                ok: false,
                msg: "contraseña invalida",
                rut
            });
        }

        //Generar nuestro JWT
        const token = await generarJWT( usuario.id, usuario.nombre);
    
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            nombre: usuario.nombre,
            token
        });  
    
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "error",
           
        });  
    }
}

const revalidarToken = async (req, res = response ) => {

    const { uid, nombre } = req.body;

    //Generar JWT
    const token = await generarJWT( uid, nombre)
    res.json({
        ok: true,
        token
    })
}
module.exports = {
    loginUsuario,
    revalidarToken
}