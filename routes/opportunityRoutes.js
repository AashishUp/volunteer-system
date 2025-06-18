const express = require('express');
const router = express.Router();
const {
    createOpportunity,
    getAllOpportunities,
    getMyOpportunities,
    applyToOpportunity,
    getApplicants
} = require ('../controllers/opportunityController');
const protect = require('../middleware/authMiddleware');

router.get('/', getAllOpportunities);
router.post('/', protect, createOpportunity);
router.get('/my', protect, getMyOpportunities);

router.post('/:id/apply', protect, applyToOpportunity);
router.get('/:id/applicants', protect, getApplicants);

module.exports = router;