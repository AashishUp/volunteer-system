const express = require('express');
const router = express.Router();
const {
    createOpportunity,
    getAllOpportunities,
    getMyOpportunities,
} = require ('../controllers/opportunityController');
const protect = require('../middleware/authMiddleware');

router.get('/', getAllOpportunities);

router.post('/', protect, createOpportunity);
router.get('/my', protect, getMyOpportunities);

module.exports = router;