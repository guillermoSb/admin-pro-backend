const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');   // Model de Usuario
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {

    const usuarios = await Usuario.find({}, 'nombre email google img role');

    res.status(400).json({
        ok: true,
        usuarios
    })
}

const crearUsuarios = async (req, res = response) => {

    const { email, password } = req.body;



    try {
        // * Buscar un usuario existente
        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado.'
            })
        }
        // * Crear usuario
        const usuario = new Usuario(req.body);

        // * Encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        // * Guardar usuario
        await usuario.save();
        // * Obtener token
        const id = usuario.id;
        const token = await generarJWT(id);
        res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        // * Enviar error
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}

const modificarUsuario = async (req, res = response) => {

    // TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;

    try {

        // * Buscar el usuario
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            })
        }


        // * Actualizar
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {
            const existeEmail = await Usuario.findOne({ email: email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El correo ya esta registrado.'
                })
            }
        }

        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });


        res.json({
            ok: true,
            usuario: usuarioActualizado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const borrarUsuario = async (req, res = response) => {
    try {
        const {id} = req.params;
        const usuarioDB = await Usuario.findById(id);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            })
        }

        await Usuario.findByIdAndDelete(id);
        
        return res.json({
            ok: true,
            id
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Algo ha salido mal'
        })
    }
    
}


module.exports = { getUsuarios, crearUsuarios, modificarUsuario, borrarUsuario }