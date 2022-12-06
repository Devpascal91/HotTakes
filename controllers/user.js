const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
// const dotenv = require("dotenv").config();
const emailValidator = require("email-validator");
const passwordValidator = require("password-validator")


// Creation schema passwordValidator

let schemaMDP = new passwordValidator();
// Add properties to it
schemaMDP
.is().min(8)                                    // longueur mini 8
.is().max(20)                                  // longueur max 20
// .has().uppercase(1)                              // min majuscule 1
// .has().lowercase(1)                              // min minuscule 1
// .has().digits(1)                                // min nombre 1
// .has().not().spaces()                           // pas d'espaces
// .is().not().oneOf(['Passw0rd', 'Password123', 'Azerty1', 'Azerty2']); 

// création du compte utilisateur
exports.signup = (req, res, next) => {
  if(!emailValidator.validate(req.body.email)) {
      throw  "Adresse email invalide !" 
  } else if (!schemaMDP.validate(req.body.password)) {
      throw  "Mot de passe invalide !"
  } else {
      // Crypter le mot de passe
      bcrypt.hash(req.body.password, 10)//bcrypt hash le mdp
      
          .then(hash => {
              const user = new User ({
                  email: req.body.email,
                  password: hash
              });
              user.save()
                  .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                  .catch(error => res.status(400).json({ error }))
          })
          .catch(error => res.status(500).json({ error }))
  };   
};

// connexion compte utilisateur

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email})
      .then(user => {//Dans le cas contraire, nous renvoyons une erreur401 Unauthorized
          if (!user) {
              return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
          }
          bcrypt.compare(req.body.password, user.password)
              .then(valid => {
                // console.log(valid)
                  if (!valid) {
                      return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                  }
                  res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(//Nous utilisons la fonction sign de jsonwebtoken pour chiffrer un nouveau token.Ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token).
                            { userId: user._id },
                            process.env.TOKEN_SECRET,// chiffrage secret
                            { expiresIn: '24h' }//durée de validité du token à 24 heures. L'utilisateur devra donc se reconnecter au bout de 24 heures.
                        )
                    });
                })
              .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};