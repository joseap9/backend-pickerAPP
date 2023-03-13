//Rutas de login de usuario

const { Router } = require('express');
const { check } = require('express-validator')
const router = Router();

const { loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

router.post('/',
[
    //middleware
    check('email', 'El email es obligatorio').isEmail(),
    //check('rut', 'el rut debe tener minimo 6 caracteres').isLength({ min: 6}),
    check('password', 'la contraseña debe tener minimo 6 caracteres').isLength({ min: 6}),
    validarCampos
]
,loginUsuario);

router.get('/renew',
validarJWT,
revalidarToken);

module.exports = router;