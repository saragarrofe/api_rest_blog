const express = require('express');
const connectDB = require('./database/connection');
const cors = require("cors")

 // Crear servidor Node 
const app = express();

// Configurar cors
app.use(cors())

// Convertir body a objeto js 
app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 


// RUTAS
const articleRoutes = require("./routes/article.js");

//Cargo las rutas
app.use("/api", articleRoutes)


// Crear servidor y escuchar peticiones http
const port = 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error al iniciar el servidor:', error);
  });


 
