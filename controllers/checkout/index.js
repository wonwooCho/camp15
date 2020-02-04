const express = require('express');
const router = express.Router();
const ctrl = require('./checkout.ctrl');

router.get('/', ctrl.index);
router.get('/complete', ctrl.post_complete);
router.get('/success', ctrl.get_success);

module.exports = router;