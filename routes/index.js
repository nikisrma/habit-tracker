var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('pages/loginPage', { title: 'Express' });
});


/* GET signup page. */
router.get('/sign-up', function(req, res, next) {
  res.render('pages/signupPage', { title: 'Express' });
});


/* GET default habit page. */
router.get('/default-habit', function(req, res, next) {
  res.render('pages/defaultHabit', { title: 'Express' });
});


/* GET My habit page. */
router.get('/my-habit', function(req, res, next) {
  res.render('pages/mainpage', { title: 'Express' });
});


/* GET add habit page. */
router.get('/add-habit', function(req, res, next) {
  res.render('pages/addHabit', { title: 'Express' });
});


/* GET habit detail page. */
router.get('/habit-detail', function(req, res, next) {
  res.render('pages/detail', { title: 'Express' });
});

module.exports = router;
