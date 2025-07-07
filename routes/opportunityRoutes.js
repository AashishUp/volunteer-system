const express = require('express');
const router = express.Router();
const {
    createOpportunity,
    getAllOpportunities,
    getMyOpportunities,
    applyToOpportunity,
    getApplicants,
    updateOpportunity,
    deleteOpportunity,
    approveApplicant,
    markAsCompleted,
    getRecommendedOpportunities,
    getUserDashboard
} = require ('../controllers/opportunityController');
const protect = require('../middleware/authMiddleware');

router.get('/', getAllOpportunities);
router.post('/', protect, createOpportunity);
router.get('/my', protect, getMyOpportunities);

router.post('/:id/apply', protect, applyToOpportunity);
router.get('/:id/applicants', protect, getApplicants);

router.put('/:id', protect, updateOpportunity);
router.delete('/:id', protect, deleteOpportunity);

router.post('/:id/approve-applicant', protect, approveApplicant);
router.post('/:id/mark-completed'. protect, markAsCompleted);

router.get('/recommendations', protect, getRecommendedOpportunities);
router.get('/dashboard', protect, getUserDashboard);

module.exports = router;