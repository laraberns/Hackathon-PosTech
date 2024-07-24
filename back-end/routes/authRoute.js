const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword, getUserDetails, listFavOngs, editProfile, updateUserType, validateToken, changePassword, addFavOng, deleteFavOng } = require('../controllers/authController');
const authenticateJWT = require('../utils/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword); 
router.post('/reset-password', resetPassword);
router.get('/user-details', authenticateJWT, getUserDetails);
router.get('/fav-ongs', authenticateJWT, listFavOngs);
router.put('/edit-profile', authenticateJWT, editProfile);
router.put('/update-user-type', authenticateJWT, updateUserType);
router.get('/validate', authenticateJWT, validateToken);
router.post('/change-password', authenticateJWT, changePassword);
router.post('/add-fav-ong', authenticateJWT, addFavOng);
router.post('/delete-fav-ong', authenticateJWT, deleteFavOng);

module.exports = router;
