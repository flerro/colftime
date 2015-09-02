var express = require('express');
var router = express.Router();
var storage = require('../services/storage')
var _ = require('lodash');

router.get('/', function(req, res, next) {
  var enterTimestamp = req.query.enter ? new Number(req.query.enter) : '';
  var exitTimestamp = req.query.exit ? new Number(req.query.exit) : '';
    
  res.render('index', { title: 'Clock IN/OUT', enter: enterTimestamp, exit: exitTimestamp });
});

router.get('/month', function(req, res, next) {  
	var today = new Date();
	res.redirect("/month/" + today.getFullYear() + "/" + (today.getMonth() + 1))
});

router.get('/month/:year/:monthNum', function(req, res, next) {
	var refDate = new Date(parseInt(req.params.year), parseInt(req.params.monthNum) - 1, 1);

	storage.list(refDate, function(err, docs){
		if (err) {
			res.render('error', err)
			return
		}

		res.render('list', { title: 'Monthly', 
								items: docs, 
								refMonth: refDate, 
								totHours: _.sum(docs, 'hours') });		
	});
});

router.post('/clock', function(req, res, next) {
  switch(req.body.action) {
  	case 'Ingresso':
  			storage.clockIn();
  			res.redirect('/?enter=' + Date.now());
  			return;		
  	case 'Uscita':
  			storage.clockOut();
  			res.redirect('/?exit=' + Date.now());
  			break;
  }
});


module.exports = router;
