const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Sauce = require('./models/Sauce');
const userRoutes = require('./routes/user')
const sauceRoutes = require('./routes/sauces');
const path = require("path");
const helmet = require("helmet");
const images = require("images");


// création d'express
const app = express();

mongoose.connect(process.env.MONGOOSE)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

// Lancement de express
app.use(express.json())

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Cross-Origin-Resource-Policy", "same-site")
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


// Lancement des routes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(bodyParser.json());
app.use(helmet());
app.use(Sauce);
module.exports = app;
