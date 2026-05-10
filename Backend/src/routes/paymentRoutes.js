const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/success', paymentController.handleSuccess);
router.get('/fail', paymentController.handleFail);

module.exports = router;