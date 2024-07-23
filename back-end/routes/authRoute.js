const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authController');

// Rota de login
router.post('/login', authControllers.login);

// Rota de registro
router.post('/register', authControllers.register);

// Rota de recuperação de senha
router.post('/reset-password', authControllers.resetPassword);

module.exports = router;
