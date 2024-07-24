const express = require('express');
const router = express.Router();
const ongsControllers = require('../controllers/ongsController');
const authenticateJWT = require('../utils/authMiddleware');

router.get('/allongs', authenticateJWT, ongsControllers.getONGs);
router.get('/:id', authenticateJWT, ongsControllers.getONGById);
router.post('/addong', authenticateJWT, ongsControllers.addONG);
router.patch('/changeong', authenticateJWT, ongsControllers.changeONG);
router.delete('/:id', authenticateJWT, ongsControllers.deleteONG);

module.exports = router;
