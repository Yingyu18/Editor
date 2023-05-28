var express = require('express');
var router = express.Router();

const {
    updateRelation
} = require('../controllers/relation_controller.js');


router.patch('/update', updateRelation)



module.exports = router;