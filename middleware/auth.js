const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw "Merci de vous connecter";
    }
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.userId;
    
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Utilisateur Invalide';
    } else {
      next();
    }
  } catch {
    console.log("catch")
    res.status(401).json({
      error: new Error('Requête Invalide!')
    });
  }
}