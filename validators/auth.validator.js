const { body, validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const HabitsModel = require("../models/habit.model");
const userHabitsModel = require("../models/user_habit.model")
const { default: mongoose } = require("mongoose");

module.exports = {
  validateBody: async (req, res, next) => {
    await body("name")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Name is required")
      .run(req);

    await body("email")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email ")
      .custom((value) => {
        return userModel.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("email is alread registered");
          }
        });
      })
      .run(req);

    await body("password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Password is required")
      .run(req);

    let errors = validationResult(req).array({ onlyFirstError: true });

    if (errors.length == 0) {
      next();
    } else {
      res.status(400).send({
        message: "Something went wrong",
        errors: errors,
      });
    }
  },

  validateLogin: async (req, res, next) => {
    await body("email")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email ")
      .run(req);
    await body("password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Password is required")
      .run(req);

    let errors = validationResult(req).array({ onlyFirstError: true });

    if (errors.length == 0) {
      next();
    } else {
      res.status(401).send({
        message: "Invalid request",
        errors: errors,
      });
    }
  },

  validateAddHabit: async (req, res, next) => {
    await body("habit")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Habit is required")
      .run(req);

    let errors = validationResult(req).array({ onlyFirstError: true });

    if (errors.length == 0) {
      next();
    } else {
      res.status(400).send({
        message: "Something went wrong",
        errors: errors,
      });
    }
  },


  validateHabitStatus: async (req, res, next) => {
    await body("_id")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Habit is required")
      .custom((value) => {
        return userHabitsModel.findOne({ _id: new mongoose.Types.ObjectId(value) }).then((habit) => {
          if (!habit) {
            return Promise.reject("no habit present");
          }
        });
      })
      .run(req);
    await body("isCompleted")
      .trim()
      .not()
      .isEmpty()
      .withMessage("isCompleted is required")
      .run(req);
    await body("date")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Date is required")
      .run(req);
    let errors = validationResult(req).array({ onlyFirstError: true });

    if (errors.length == 0) {
      next();
    } else {
      res.status(400).send({
        message: "Something went wrong",
        errors: errors,
      });
    }
  },


  validateSevenDayStatus: async (req, res, next) => {
    await body("habit_id")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Habit is required")
      .custom((value) => {
        return userHabitsModel.findOne({ habit_id: new mongoose.Types.ObjectId(value) }).then((habit) => {
          if (!habit) {
            return Promise.reject("no habit present");
          }
        });
      })
      .run(req);
    let errors = validationResult(req).array({ onlyFirstError: true });

    if (errors.length == 0) {
      next();
    } else {
      res.status(400).send({
        message: "Something went wrong",
        errors: errors,
      });
    }
  },
};
