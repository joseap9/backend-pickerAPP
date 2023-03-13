const { Router } = require('express');
const { getTokenMetabase, getRankingShoppers, getDailyReport, getDate, getInfoSala, getNotasShoppers, getAnalisisShoppers, getExcelShoppers } = require('../controllers/metabase');

const router = Router();

//=============================USADOS=======================================

//obtener token de api de metabase
router.get('/getTokenMetabase', getTokenMetabase);

//obtener datos de cada shopper diario
router.get('/getRankingShoppers', getRankingShoppers);

//obtener datos de analisis por fecha
router.get('/getAnalisisShoppers', getAnalisisShoppers);

//obtener datos por fecha actual
router.get('/getDailyReport', getDailyReport);

//obtener info de cada sala del dia segun fecha
router.get('/getInfoSala', getInfoSala);

//obtener 10 peores y mejores pickers
router.get('/getNotasShoppers', getNotasShoppers);

//obtener 10 peores y mejores pickers
router.get('/getExcelShoppers', getExcelShoppers);

//=============================NO USADOS=======================================
//obtener datos de cada shopper por parametro
router.get('/getDate', getDate);

module.exports = router;