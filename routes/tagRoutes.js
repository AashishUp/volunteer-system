const express = require('express');
const router = express.Router();


const{createTag, getAllTags} = require('../controllers/tagController');

router.post('/', protect, requireOrganization, createTag);
router.get('/', getAllTags);

module.exports = router;