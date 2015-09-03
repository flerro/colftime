var express = require('express');
var router = express.Router();
var storage = require('../services/storage')
var _ = require('lodash');


router.get('/', function(req, res, next) {
	if (!req.cookies.remember) { 
		res.redirect('/pin')
		return
	}
  	
  	var enterTimestamp = req.query.enter ? new Number(req.query.enter) : '';
  	var exitTimestamp = req.query.exit ? new Number(req.query.exit) : '';
    
  	res.render('index', { title: 'Colftime', enter: enterTimestamp, exit: exitTimestamp });
});


router.get('/month', function(req, res, next) {  
	var today = new Date();
	res.redirect("/month/" + today.getFullYear() + "/" + (today.getMonth() + 1))
});


router.get('/month/:year/:monthNum', function(req, res, next) {
	var refDate = new Date(parseInt(req.params.year), parseInt(req.params.monthNum) - 1, 1);
	var halfCeil = function(v) {
		var firstDecimal = v % 1 - v % 0.1;
		var roundedHours = v - v % 1;
		if (firstDecimal >= 0.6) return roundedHours + 1
		else if (firstDecimal >= 0.1) return roundedHours + 0.5
		else return roundedHours
	};

	storage.list(refDate, function(err, docs){
		if (err) {
			res.render('error', err)
			return
		}

		_.invoke(docs, function(){
			this.hours = halfCeil(this.hours)
		});

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
  			break;		
  	case 'Uscita':
  			storage.clockOut();
  			res.redirect('/?exit=' + Date.now());
  			break;
  }
});


router.get('/pin', function(req, res, next) {
	if (req.cookies.remember) { 
		res.redirect('/')
		return
	}
	res.render('pin', { title: 'Colftime', error: req.query.err });
});

router.post('/verify', function(req, res, next) {
	var twelveMonths = 10 * 60 * 1000; //12 * 30 * 24 * 3600 * 1000;
	var pinOk = process.env.COLFTIME_PIN == req.body.PIN
	if (pinOk) {
		res.cookie('remember', 1, { maxAge: twelveMonths });
		res.redirect('/')
	} else {
		res.redirect('/pin?err=' + "Invalid PIN")
	}
});

router.get('/forget', function(req, res, next) {
	res.clearCookie('remember');
	res.redirect('/pin')
});


module.exports = router;
