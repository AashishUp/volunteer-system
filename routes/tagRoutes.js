const express = require('express');
const router = express.Router();
const isVerified = require('../middleware/isVerified');

const{createTag, getAllTags} = require('../controllers/tagController');

router.post('/', protect, requireOrganization, isVerified, createTag);
router.get('/', getAllTags);

module.exports = router;