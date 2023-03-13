/* 
    Events routes
    /api/events
*/
//Rutas de login de usuario
const { Router } = require('express');

const router = Router();

const { getDetallePicker, getPickers, getInfo } = require('../controllers/events');

//Obtener pickers
router.get('/pickers/:search',getPickers);

//Obtener pickers por el nombre dado
router.get('/picker/:search',getDetallePicker);

//Obtener info
router.get('/info',getInfo);


module.exports = router;