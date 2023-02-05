const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = ( req, res = response, next) => {
    //x-token headers
    const token = req.header('x-token')

    if( !token ){
        return res.status(401).json({
            ok:false,
            msg: "invalido"
        });
    }

    try {

        const { uid, nombre } = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
            );

        req.uid = uid;
        req.nombre = nombre;
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: "token invalido"
        });
    }

    next();
}

module.exports = {
    validarJWT
}