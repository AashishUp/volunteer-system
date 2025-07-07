const express = require('express');
const router = express.Router();

const{registerUser, loginUser, logoutUser}= require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

router.post('/register',registerUser);
router.post('/login', loginUser);

router.get('/me', protect, (req,res)=>{
    res.json({message:'You are logged in.', user:req.user,});
});

router.post('/logout', protect, logoutUser);

module.exports = router;