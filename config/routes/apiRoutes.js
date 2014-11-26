'use strict';
var express = require('express');
var router = express.Router();

var api = require('../../app/controllers/api/api');
router.get('/config', api.getConfig);
router.get('/version', api.getVersion);

module.exports = router;
