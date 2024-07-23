const express = require('express');
const router = express.Router();
const ongsControllers = require('../controllers/ongsController');

router.get('/allongs', ongsControllers.getONGs);
router.get('/:id', ongsControllers.getONGById);
router.post('/addong', ongsControllers.addONG);
router.patch('/changeong', ongsControllers.changeONG);
router.delete('/:id', ongsControllers.deleteONG);

module.exports = router;
