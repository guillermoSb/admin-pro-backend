/**
 * Ruta: /api/usuarios
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, crearUsuarios, modificarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('', validarJWT, getUsuarios);
router.post('',
    [
        validarJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        check('password', 'El password es obligatorio.').not().isEmpty(),
        check('email', 'El email es obligatorio.').not().isEmpty().isEmail(),
        
        validarCampos
    ],
    crearUsuarios
);

router.put('/:id',
    [
        validarJWT,
        check('name', 'El nombre es obligatorio.').not().isEmpty(),
        check('email', 'El email es obligatorio.').not().isEmpty().isEmail(),
        validarCampos
    ],
    modificarUsuario
);

router.delete('/:id', validarJWT, borrarUsuario);

module.exports = router;