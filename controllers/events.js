const { response } = require('express');
const Evento = require('../models/Evento');


const getPickers = async(req, res = response ) => {

  const picker = req.params.search;

  let matchCond = {}

  if (picker !== "all") {
      matchCond = {
      $or: [
          { nombre: { $regex: picker, $options: 'i' } },
          { iduser: { $regex: picker, $options: 'i' } },
        ]
      }
  }

  const evento = await Evento.aggregate([
    { 
      $match: matchCond 
    },
    {
      //agregacion para agrupar cada pickers con la info correspondiente
      $group: {
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
    //agregacion donde se crea un nuevo atributo al picker PAGO BRUTO
    {
      $addFields: {
        pago_bruto: {
            $add: [
              { $multiply: ["$mayor", 3200] },
              { $multiply: ["$menor", 2700] }
            ]
        }
      }
    },
    //agregacion donde se crea un nuevo atributo al picker PAGO LIQUIDO
    {
      $addFields: {
        pago_liquido: {
          $subtract: [
            "$pago_bruto",
            { $multiply: ["$pago_bruto", 0.12] }
          ]
        }
      }
    },
    //agregacion para agrupar en 2, por un lado todos los pickers y por el otro la suma total de cada pago
    {
      $group: {
        _id: null,
        sum_total: { $sum: "$pago_bruto" },
        pickers: {
          $push: {
            iduser: "$_id",
            nombre: "$nombre",
            tienda: "$tienda",
            total: "$total",
            menor: "$menor",
            mayor: "$mayor",
            pago_bruto: "$pago_bruto",
            pago_liquido: "$pago_liquido",
          }
        }
      }
    },
    //Y cada id (persona) en un objeto con los datos agrupados
    { $project: {
        _id: 0,
        sum_total: 1,
        pickers: {
          iduser: 1,
          nombre: 1,
          tienda: 1,
          total: 1,
          menor: 1,
          mayor: 1,
          pago_bruto: 1,
          pago_liquido: 1
        }
       
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


//obtener todas los pedidos de cierta tienda
const getDetallePicker = async(req, res = response ) => {
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
            remuneracion_bruta:{ $convert: { input: { $sum: [ { $multiply: [ "$menor", 2700 ] }, { $multiply: [ "$mayor", 3200 ] } ] }, to: "double" } },
            pay_liquid: { $subtract: [ "$remuneracion_bruta", { $multiply: [ "$remuneracion_bruta", 0.12 ] } ] }
            
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

module.exports = {
  getPickers, getDetallePicker, getInfo
}