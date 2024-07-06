var express = require('express');
var router = express.Router();
var UserCtrl= require('../controller/user.controller');
/* GET users listing. */
router.get('/',UserCtrl.getAll);
router.post('/update/:id',UserCtrl.update);
router.get('/search',UserCtrl.search);
module.exports = router;
