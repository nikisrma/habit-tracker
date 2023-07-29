var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/loginPage', { title: 'Express' });
});


router.get('/sign-up', function(req, res, next) {
  res.render('pages/signupPage', { title: 'Express' });
});


router.get('/default-habit', function(req, res, next) {
  res.render('pages/defaultHabit', { title: 'Express' });
});

router.get('/my-habit', function(req, res, next) {
  res.render('pages/mainpage', { title: 'Express' });
});


router.get('/add-habit', function(req, res, next) {
  res.render('pages/addHabit', { title: 'Express' });
});

router.get('/habit-detail', function(req, res, next) {
  res.render('pages/detail', { title: 'Express' });
});
module.exports = router;
