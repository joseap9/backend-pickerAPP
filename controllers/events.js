const { response } = require('express');
const Evento = require('../models/Evento');

//obtener todas los pedidos de cierta tienda
const getPicker = async(req, res = response ) => {
    const picker = req.params.search;

    let matchCond = {}

    if (picker !== "pic") {
        matchCond = {
        $or: [
            { nombre: { $regex: picker, $options: 'i' } },
            { iduser: { $regex: picker, $options: 'i' } },
         ]
        }
    }

    const evento = await Evento.aggregate([
        {$match: matchCond},
        {$group: {
            //por el id
            _id: "$iduser",
            //donde muestra el nombre
            nombre: { $first: "$nombre" },
            tienda: { $first: "$tienda" },
            //me cuente el total de iteraciones
            total: { $sum: 1 },
            //filtre la cantidad de iteraciones donde el resultado es MENOR a 50
            menor: {
              $sum: {
                $cond: [
                  { $lte: ["$sku_solicitado", 50] },
                  1,
                  0
                ]
              }
            },
            //filtre la cantidad de iteraciones donde el resultado es MAYOR a 50
            mayor: {
              $sum: {
                $cond: [
                  { $gte: ["$sku_solicitado", 51] },
                  1,
                  0
                ]
              }
            },

          }
        },
        //Y cada id (persona) en un objeto con los datos agrupados
        { $project: {
            _id: 0,
            userid: "$_id",
            nombre: "$nombre",
            total: "$total",
            menor: { $convert: { input: "$menor", to: "double" } },
            mayor: { $convert: { input: "$mayor", to: "double" } },
            tienda: "$tienda",
            remuneracion_bruta: { $sum: [ { $multiply: [ "$menor", 2700 ] }, { $multiply: [ "$mayor", 3200 ] } ] },
            
            }
        }
    ]);

    try {
        res.json({
            ok: true,
            msg: "all good",
            evento
        }) 
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "error",        
        }); 
    } 
}

//obtener todas los pedidos de cierta picker
const getPedidos = async(req, res = response ) => {
    
    const picker = req.iduser
    const eventos = await Evento.find({iduser: picker});

    return res.status(200).json({
        ok: true,
        msg: "get jumbos",
        evento: eventos,        
    });  
}

//Conteo de cada pedido por cada picker
const getConteo = async(req, res = response ) => {
    
    const eventos = await Evento.aggregate([
        { $group: { _id: "$iduser", count: { $sum: 1 } } },
    ]);

    return res.status(200).json({
        ok: true,
        msg: "get jumbos",
        evento: eventos,        
    });  
}

//info general de cada pickers y sus pedidos
const getInfo = async(req, res = response ) => {

    const info = await Evento.aggregate([
        //agrupa
        { $group: {
            //por el id
            _id: "$iduser",
            //donde muestra el nombre
            nombre: { $first: "$nombre" },
            tienda: { $first: "$tienda" },
            //me cuente el total de iteraciones
            total: { $sum: 1 },
            //filtre la cantidad de iteraciones donde el resultado es MENOR a 50
            menor: {
              $sum: {
                $cond: [
                  { $lte: ["$sku_solicitado", 50] },
                  1,
                  0
                ]
              }
            },
            //filtre la cantidad de iteraciones donde el resultado es MAYOR a 50
            mayor: {
              $sum: {
                $cond: [
                  { $gte: ["$sku_solicitado", 51] },
                  1,
                  0
                ]
              }
            },

          }
        },
        //Y cada id (persona) en un objeto con los datos agrupados
        { $project: {
            _id: 0,
            userid: "$_id",
            nombre: "$nombre",
            total: "$total",
            menor: { $convert: { input: "$menor", to: "double" } },
            mayor: { $convert: { input: "$mayor", to: "double" } },
            tienda: "$tienda",
            remuneracion_bruta: { $sum: [ { $multiply: [ "$menor", 2700 ] }, { $multiply: [ "$mayor", 3200 ] } ] },
            
            }
        }
      ])


    return res.status(200).json({
        ok: true,
        msg: "all good",
        evento: info,        
    });  
}


const crearEvento = async(req, res = response ) => {

    const eventoGuardado = new Evento( req.body );

    try {

        await eventoGuardado.save();

        res.json({
            ok: true,
            msg: "evento guardado",
            evento: eventoGuardado
        })
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "error",        
        }); 
    }

}

const actualizarEvento = async(req, res = response ) => {
    return res.status(200).json({
        ok: false,
        msg: "evento actualizar",        
    });
}

const eliminarEvento = async(req, res = response ) => {
    return res.status(200).json({
        ok: false,
        msg: "eliminado crear",        
    });
}

module.exports = {
    getPicker, crearEvento, actualizarEvento, eliminarEvento, getPedidos, getConteo, getInfo
}