
const {response} = require('express');
const bcrypt = require('bcryptjs');


const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async(req, res = response) => {

    const {email, password} = req.body;

    try {

        const usuarioDb = await Usuario.findOne({email})

        // Verificar email

        if (!usuarioDb) {
            return res.status(400).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }
        
        // Verificar password

        const validPassword = bcrypt.compareSync(password, usuarioDb.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La password no es valida.'
            })
        }

        // Generar el token

        const token = await generarJWT(usuarioDb.id);


        return res.json({
            ok: true,
            token
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error, hable con el administrador.'
        })
    }
}

module.exports = {
    login
}