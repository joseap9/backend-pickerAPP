const express = require('express');
const cors = require("cors");
require('dotenv').config();

const { dbConnection } = require('./database/config');
const { authenticate } = require('./database/metabase');



const app = express();

//Base de datos datos
dbConnection();

//metabase
//authenticate();

// habilitar CORS
app.use(cors());

//Directorio publico
app.use( express.static( 'public' ) );

// Lectura y parseo del body
app.use( express.json() );

// Rutas
app.use('/api/auth', require('./routes/auth') );
app.use('/api/events', require('./routes/events') );
app.use('/api/metabase', require('./routes/metabase') );

app.listen( process.env.PORT , () => { 
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`)
    
} );