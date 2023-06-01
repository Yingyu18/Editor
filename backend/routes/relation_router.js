var express = require('express');
var router = express.Router();

const {
    updateRelation,
    updatePage,
    getCited
} = require('../controllers/relation_controller.js');


router.patch('/update', updateRelation)
router.patch('/updatePage', updatePage)
router.get('/getCited/:pageName', getCited )



module.exports = router;