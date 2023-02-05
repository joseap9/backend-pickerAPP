/* 
    Events routes
    /api/events
*/
//Rutas de login de usuario
const { Router } = require('express');

const router = Router();

const { getPicker, crearEvento, actualizarEvento, eliminarEvento, getPedidos, getConteo, getInfo } = require('../controllers/events');

//Obtener pickers por el nombre dado
router.get('/picker/:search',getPicker);

//Obtener picker
router.get('/conteo',getConteo);

//Obtener info
router.get('/info',getInfo);

//Obtener pedidos picker
router.post('/pedidos',getPedidos);

//Crear Evento
router.post('/', crearEvento);

//Actualizar Evento
router.put('/:id',actualizarEvento);

//Eliminar Evento
router.delete('/:id', eliminarEvento);


module.exports = router;