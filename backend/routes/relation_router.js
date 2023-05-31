var express = require('express');
var router = express.Router();

const {
    updateRelation,
    updatePage
} = require('../controllers/relation_controller.js');


router.patch('/update', updateRelation)
router.patch('/updatePage', updatePage)



module.exports = router;