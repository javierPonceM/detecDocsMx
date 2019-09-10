const express = require('express');
const router = express.Router();
const path = require("path");

var analyzeDocs = require(path.join(__dirname, '../modules/analyzeDocs'));


router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../../public', 'poc-demo.html'));
});

router.post('/docsAnalyze', analyzeDocs.analyze);

module.exports = router;
