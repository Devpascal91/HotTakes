const express = require('express');
const auth = require('../middleware/auth');
const SaucesCtrl = require('../controllers/sauce');
const multer = require('../middleware/multer-config.js');

const router = express.Router();

// Enregistrement des routes dans le routeur
router.get('/', auth, SaucesCtrl.getAllSauce);
router.post('/', auth, multer, SaucesCtrl.createSauce);
router.get('/:id', auth, SaucesCtrl.getOneSauce);
router.put('/:id', auth, multer, SaucesCtrl.modifySauce);
router.delete('/:id', auth, SaucesCtrl.deleteSauce);
router.post('/:id/like', auth, SaucesCtrl.likeDislike);

module.exports = router;