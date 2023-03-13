const axios = require('axios');
const { response } = require('express');
const fs = require('fs');

const getInfoSala = async (req, res = response) => {

    const fecha_inicio = req.query.fecha_inicio;
    const fecha_termino = req.query.fecha_termino ;

    const params = [
        {
            "type":"date/single",
            "target":[
                "variable",
                [
                    "template-tag",
                    "fecha_inicio"
                ]
            ],
            "value": `${fecha_inicio}`
        },
        {
            "type":"date/single",
            "target":[
                "variable",
                [
                    "template-tag",
                    "fecha_termino"
                ]
            ],
            "value": `${fecha_termino}`
        }
    ]

    const serializer = encodeURIComponent(JSON.stringify( params ));

    try {

        const headers = { "X-Metabase-Session": req.query.token };
        
        const response = await axios.post(`https://metabase.ecomm.cencosud.com/api/card/1777/query/json?parameters=${serializer}`,
        {
        },
        {
            headers, 
        });
        
        
        res.json({
            ok: true,
            msg: "all good",
            response: response.data
       }); 

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "error", 
            error: error       
        });
    }
}

const getDate = async (req, res = response) => {

    const params = [
        {
            "type":"date/single",
            "target":[
                "variable",
                [
                    "template-tag",
                    "fecha_inicio"
                ]
            ],
            "value":"2023-01-04"
        },
        {
            "type":"date/single",
            "target":[
                "variable",
                [
                    "template-tag",
                    "fecha_termino"
                ]
            ],
            "value":"2023-01-06"
        }
    ]

    const serializer = encodeURIComponent(JSON.stringify( params ));

    try {

        

        const headers = { "X-Metabase-Session": req.query.token };
        
        const response = await axios.post(`https://metabase.ecomm.cencosud.com/api/card/1778/query/json?parameters=${serializer}`,
        {
        },
        {
            headers, 
        });
        
        
        res.json({
            ok: true,
            msg: "all good",
            response: response.data
       }); 

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "error", 
            error: error       
        });
    }
}

const getDailyReport = async (req, res = response) => {

    try {

        const headers = { "X-Metabase-Session": req.query.token };
        
        const response = await axios.post(`https://metabase.ecomm.cencosud.com/api/card/1778/query/json`,
        {
        },
        {
            headers, 
        });
        
        
        res.json({
            ok: true,
            msg: "all good",
            response: response.data
       }); 

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "error", 
            error: error       
        });
    }
}

const getRankingShoppers = async (req, res = response) => {
    try {
        const headers = { "X-Metabase-Session": req.query.token };

        const response = await axios.post("https://metabase.ecomm.cencosud.com/api/card/1779/query/json",
        {},
        {
            headers,
        });
        
        res.json({
            ok: true,
            msg: "all good",
            response: response.data
       }); 
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "error", 
            error: error       
        });
    }
}

const getAnalisisShoppers = async (req, res = response) => {

    const fecha_inicio = req.query.fecha_inicio;
    const fecha_termino = req.query.fecha_termino;
    const { store } = req.query;

    const params = [
        {
            "type":"date/single",
            "target":[
                "variable",
                [
                    "template-tag",
                    "fecha_inicio"
                ]
            ],
            "value": `${fecha_inicio}`
        },
        {
            "type":"date/single",
            "target":[
                "variable",
                [
                    "template-tag",
                    "fecha_termino"
                ]
            ],
            "value": `${fecha_termino}`
        },
        {
            "type": "category",
            "target": ["dimension", ["template-tag", "local"]],
            "value": `${store}`
        }
    ]

    const serializer = encodeURIComponent(JSON.stringify( params ));

    try {
       const headers = { "X-Metabase-Session": req.query.token };

       const response = await axios.post(`https://metabase.ecomm.cencosud.com/api/card/1779/query/json?parameters=${serializer}`,
        {},
        {
            headers,
        });

        const { data } = response

        const num_trabajadores = data.length;
        
        const sum_pedidos = data.reduce((acc, worker) => acc + worker.pedidos, 0);
        const sum_tiempo_pedidos = data.reduce((acc, worker) => acc + (worker["min/sku's"] * worker["sku`s/op"]), 0);
        const sum_sku_pedidos = data.reduce((acc, worker) => acc + worker["sku`s/op"], 0);
        const sum_tiempo_sku = data.reduce((acc, worker) => acc + worker["min/sku's"], 0);
        const sum_items_pedidos = data.reduce((acc, worker) => acc + worker.unidades_solicitados / worker["sku`s/op"], 0);

        const pedidos_x_picker = sum_pedidos / num_trabajadores;
        const tiempo_x_pedido = sum_tiempo_pedidos / num_trabajadores;
        const sku_x_pedido = sum_sku_pedidos / num_trabajadores;
        const tiempo_x_sku = sum_tiempo_sku / num_trabajadores;
        const items_x_pedido = sum_items_pedidos / num_trabajadores;

        const analisis = [
            { 
                pedidos_x_picker,
                tiempo_x_pedido,
                items_x_pedido,
                sku_x_pedido,
                tiempo_x_sku
             },
          ];


        
        res.json({
            ok: true,
            msg: "all good",
            response: analisis
       }); 
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "error", 
            error: error       
        });
    }
}
const getNotasShoppers = async (req, res = response) => {

    const fecha_inicio = req.query.fecha_inicio;
    const fecha_termino = req.query.fecha_termino ;

    const params = [
        {
            "type":"date/single",
            "target":[
                "variable",
                [
                    "template-tag",
                    "fecha_inicio"
                ]
            ],
            "value": `${fecha_inicio}`
        },
        {
            "type":"date/single",
            "target":[
                "variable",
                [
                    "template-tag",
                    "fecha_termino"
                ]
            ],
            "value": `${fecha_termino}`
        }
    ]

    const serializer = encodeURIComponent(JSON.stringify( params ));

    try {
        const headers = { "X-Metabase-Session": req.query.token };
        const { store } = req.query;

        const response = await axios.post(`https://metabase.ecomm.cencosud.com/api/card/1779/query/json?parameters=${serializer}`,
        {},
        {
            headers,
        });

        const sortedData = response.data.filter((persona) => persona.empresa === "Carlos-Diaz").sort((a, b) => a.nota - b.nota);

        const peoresNotas = [];
        const mejoresNotas = [];

        ["JUMBO COSTANERA", "JUMBO LA REINA", "JUMBO BILBAO"].forEach((tienda) => {
            let notasPorTienda = sortedData.filter( (persona) => persona.tienda === tienda);

            if ( store && store !== tienda ) return;
            
            if (notasPorTienda.length > 0) {
                peoresNotas.push(...notasPorTienda.slice(0, 20));
                mejoresNotas.push(...notasPorTienda.slice(-20));
            }

            
        });

        const resultado = {
            peoresNotas,
            mejoresNotas
        };
        
        res.json({
            ok: true,
            msg: "all good",
            response: resultado
       }); 
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "error", 
            error: error       
        });
    }
}

const getExcelShoppers = async (req, res = response) => {

    const fecha_inicio = req.query.fecha_inicio;
    const fecha_termino = req.query.fecha_termino ;

    const params = [
        {
            "type":"date/single",
            "target":[
                "variable",
                [
                    "template-tag",
                    "fecha_inicio"
                ]
            ],
            "value": `${fecha_inicio}`
        },
        {
            "type":"date/single",
            "target":[
                "variable",
                [
                    "template-tag",
                    "fecha_termino"
                ]
            ],
            "value": `${fecha_termino}`
        }
    ]

    const serializer = encodeURIComponent(JSON.stringify( params ));

    try {
        const headers = { "X-Metabase-Session": req.query.token };
        //const { store } = req.query;

        const response = await axios.post(`https://metabase.ecomm.cencosud.com/api/card/1779/query/csv?parameters=${serializer}`,
        {},
        {
            headers,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream('data.xlsx');
        response.data.pipe(writer);

        writer.on('finish', () => {
            res.download('data.xlsx');
            res.json({
                ok: true,
                msg: "all good",
                response: response.data
           });  // Descarga el archivo
        });

        writer.on('error', (err) => {
            console.error(err);
            res.status(500).json({
              ok: false,
              msg: 'Error al descargar los datos',
              error: err,
            });
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "error", 
            error: error       
        });
    }
}

const getTokenMetabase = async (req, res = response) => {

    try {
        const response = await axios.post("https://metabase.ecomm.cencosud.com/api/session", {
            username: "EF3671",
            password: "Cd022023$"
        });
        
        console.log("metabase online");

        return res.json({
            ok: true,
            msg: "all good",
            token: response.data.id
       });
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getRankingShoppers, getTokenMetabase, getDailyReport, getDate, getInfoSala, getNotasShoppers, getAnalisisShoppers, getExcelShoppers
}



/* const getSql = async (req, res = response) => {
    try {
        //const sqlQuery = 'SELECT * FROM vw_master_pickers_data_lidia_leyton'
        const headers = { "X-Metabase-Session": req.query.token };

        const response = await axios.post("https://metabase.ecomm.cencosud.com/api/dataset/",
        {
            database: 2,
            type: 'native',
            native: {
                query: 'SELECT * FROM vw_master_pickers_data_lidia_leyton WHERE op = 80349650',
            },
        },
        {
            headers,
        });
        
        console.log(response)
        res.json({
            ok: true,
            msg: "all good",
            response: response.data
       }); 
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "error", 
            error: error       
        });
    }
} */

/* const getRankingShoppers = async (req, res = response) => {
    
    try {
       
        const session = await authenticate();
        const headers = { "X-Metabase-Session": session };

        const response = await axios.post("https://metabase.ecomm.cencosud.com/api/card/1779/query/json",
        {},
        {
            headers,
        });
        
        res.json({
            ok: true,
            msg: "all good",
            response: response.data
       });
    } catch (error) {

        return res.status(500).json({
            ok: false,
            msg: "error", 
            error: error       
        });
    }
} */