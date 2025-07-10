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
    getUserDashboard,
    searchOpportunities
} = require ('../controllers/opportunityController');
const protect = require('../middleware/authMiddleware');
const isVerified = require('../middleware/isVerified');

router.get('/', getAllOpportunities);
router.post('/', protect, isVerified, createOpportunity);
router.get('/my', protect, getMyOpportunities);

router.post('/:id/apply', protect, isVerified, applyToOpportunity);
router.get('/:id/applicants', protect, getApplicants);

router.put('/:id', protect, updateOpportunity);
router.delete('/:id', protect, deleteOpportunity);

router.post('/:id/approve-applicant', protect, approveApplicant);
router.post('/:id/mark-completed'. protect, markAsCompleted);

router.get('/recommendations', protect, getRecommendedOpportunities);
router.get('/dashboard', protect, getUserDashboard);

router.get('/search', searchOpportunities);
module.exports = router;