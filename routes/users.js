var express = require('express');
var router = express.Router();
const authValidator = require("../validators/auth.validator")
const userController = require("../controller/user.controller")
const authMiddleware = require("../middleware/middleware")
router.post('/register', authValidator.validateBody,userController.register);
router.post('/login', authValidator.validateLogin,userController.login);
router.post('/add-default-habit',authMiddleware,userController.addDefaultHabit);
router.post('/add-habit',authMiddleware, authValidator.validateAddHabit,userController.addHabit);
router.post('/get-list',authMiddleware,userController.getHabitsList);
router.post('/change-habit-status',authMiddleware, authValidator.validateHabitStatus,userController.changeHabitStatus);
router.post('/seven-day-data',authMiddleware, authValidator.validateSevenDayStatus,userController.getHabitsLast7Days);


module.exports = router;
