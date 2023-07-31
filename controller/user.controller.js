const userModel = require("../models/user.model");
const habitsModel = require("../models/habit.model");
const userHabitsModel = require("../models/user_habit.model");
const saltRounds = 8;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");

function findMissingHabits(habitArray, userHabitArray) {
  const habitIds = habitArray.map((item) => item._id.toString());
  const userHabitIds = userHabitArray.map((item) => item.habit_id.toString());
  const missingHabitIds = habitIds.filter((id) => !userHabitIds.includes(id));
  return missingHabitIds;
}

function getCurrentDate(date = new Date()) {
  const currentDate = new Date(date);
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

module.exports = class userController {
  static async register(req, res, next) {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    let user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
    if (user) {
      res
        .status(201)
        .send({ status: 1, message: "User Created Successfully", data: user });
    } else {
      res.status(400).send({ status: 0, message: "Something went wrong" });
    }
  }

  /**********************************register ends  *************************************************************** */

  static async login(req, res) {
    let user = await userModel.findOne(
      { email: req.body.email },
      "email password "
    );
    if (!user) {
      res.status(400).send({ status: 0, message: "User Not Found" });
    } else {
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (isMatch) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email: user.email },
          "mysecretKeyf2121",
          { expiresIn: "36h" }
        );
        await userModel.findOneAndUpdate({ _id: user?._id }, { token: token });
        user = await userModel.findOne(
          { email: req.body.email },
          "email name phone token"
        );
        res.status(200).send({
          message: "Log in successfully",
          data: user,
          status: 1,
        });
      } else {
        res.status(403).send({ message: "Invalid Credentials", status: 0 });
      }
    }
  }
  /**********************************Login Ends *************************************************************** */

  static async addDefaultHabit(req, res) {
    try {
      let { habits } = req.body;
      if (!habits || habits.length == 0) {
        return res.status(500).json({ message: "habits is required" });
      }
      const user = await userModel.findById(req.user.user_id);
      if (user.habits.length > 0) {
        return res
          .status(500)
          .json({
            message: "You already have added habits.Please skip this page",
          });
      }

      for (let i = 0; i < habits.length; i++) {
        if (
          !user.habits ||
          !user.habits.some((obj) => obj.habit === habits[i])
        ) {
          let habit = await habitsModel.create({
            name: habits[i],
            user: new mongoose.Types.ObjectId(user._id),
          });
          user.habits.push(habit);
        }
      }

      await user.save();
      res
        .status(200)
        .send({ status: 1, message: "Habits added successfully." });
    } catch (err) {
      console.error("Error adding habit:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async addHabit(req, res) {
    try {
      const new_habit = req.body.habit;
      const user = await userModel.findById(req.user.user_id);
      const userHabits = await habitsModel.find({ user: req.user.user_id });
      const isHabitPresent = userHabits.some((obj) => obj.name === new_habit);
      console.log(isHabitPresent);
      if (isHabitPresent) {
        return res
          .status(409)
          .json({ message: "Habit already exists for the user." });
      }

      let habit = await habitsModel.create({
        name: new_habit,
        user: new mongoose.Types.ObjectId(user._id),
      });
      user.habits.push(habit);
      await user.save();

      res.status(200).send({ message: "Habit added successfully.", status: 1 });
    } catch (err) {
      console.error("Error adding habit:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async getHabitsList(req, res) {
    try {
      let todayDate = req.body.date ? new Date(req.body.date) : new Date();
      // const formattedDate = getCurrentDate(date);
      todayDate.setHours(0, 0, 0, 0); // Set time to start of the day (00:00:00.000)
      const tomorrow = new Date(todayDate);
      tomorrow.setDate(todayDate.getDate() + 1); // Set time to start of the next day (00:00:00.000)

      let user = req.user;

      /** Get habits for user */
      let habitForUser = await habitsModel.find({
        user: new mongoose.Types.ObjectId(user.user_id),
      });

      if (habitForUser.length === 0) {
        return res.status(409).json({ message: "No habits found" });
      } else {
        var getHabitsForDate = [];
        getHabitsForDate = await userHabitsModel.find({
          user_id: new mongoose.Types.ObjectId(user.user_id),
          // date: date,
          date: {
            $gte: todayDate,
            $lt: tomorrow,
          },
        });

        /** Find habits for the date */
        if (getHabitsForDate.length > 0) {
          /** if habits for the user for a particular date and habits for the user are same */
          if (getHabitsForDate.length === habitForUser.length) {
            const habits = await userHabitsModel
              .find({
                user_id: new mongoose.Types.ObjectId(user.user_id),
                date: {
                  $gte: todayDate,
                  $lt: tomorrow,
                },
              })
              .populate({
                path: "habit_id",
                select: "name",
              });

            res.status(200).send({
              message: "Habit found successfully.",
              data: habits,
              status: 1,
            });
          } else {
            /** else find habits that are not present in userhabit list and add them to the list */
            let missingHabits = findMissingHabits(
              habitForUser,
              getHabitsForDate
            );
            let newHabits = [];
            for (let i = 0; i < missingHabits.length; i++) {
              let data = {
                isCompleted: false,
                date: todayDate,
                habit_id: missingHabits[i],
                user_id: user.user_id,
              };
              newHabits.push(data);
            }
            await userHabitsModel.insertMany(newHabits);

            const updatedHabits = await userHabitsModel
              .find({
                user_id: new mongoose.Types.ObjectId(user.user_id),
                date: {
                  $gte: todayDate,
                  $lt: tomorrow,
                },
              })
              .populate({
                path: "habit_id",
                select: "name",
              });

            if (updatedHabits) {
              res.status(200).send({
                message: "Habit found successfully.",
                data: updatedHabits,
                status: 1,
              });
            }
          }
        } else {
          /** If there are no habits for the date, then create new ones */
          getHabitsForDate = [];
          for (let i = 0; i < habitForUser.length; i++) {
            let data = {
              isCompleted: false,
              date: todayDate,
              habit_id: habitForUser[i]?._id,
              user_id: user.user_id,
            };
            getHabitsForDate.push(data);
          }
          let addHabitForDate = await userHabitsModel.insertMany(
            getHabitsForDate
          );

          const habits = await userHabitsModel
            .find({
              user_id: new mongoose.Types.ObjectId(user.user_id),
              date: {
                $gte: todayDate,
                $lt: tomorrow,
              },
            })
            .populate({
              path: "habit_id",
              select: "name",
            });

          if (addHabitForDate) {
            res.status(200).send({
              message: "Habit found successfully.",
              data: habits,
              status: 1,
            });
          }
        }
      }
    } catch (err) {
      console.error("Error adding habit:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async changeHabitStatus(req, res) {
    try {
      let user = req.user;
      const { _id, isCompleted, date } = req.body;
      let todayDate = req.body.date ? new Date(req.body.date) : new Date();
      todayDate.setHours(0, 0, 0, 0);
      let habitForUser = await userHabitsModel.findOne({
        _id: new mongoose.Types.ObjectId(_id),
        user_id: new mongoose.Types.ObjectId(user.user_id),
        date: todayDate
      });
      if (!habitForUser) {
        res.status(400).json({ message: "No habit found for this user" });
      } else {
        console.log(JSON.parse(isCompleted));
        await userHabitsModel.findByIdAndUpdate(
          { _id: new mongoose.Types.ObjectId(_id) },
          { isCompleted: !JSON.parse(isCompleted) }
        );
        res.json({ message: "status changes successfully." });
      }
    } catch (err) {
      console.error("Error adding habit:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async getHabitsLast7Days(req, res) {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { habit_id } = req.body;
    const user = req.user;
    try {
      const habitData = await userHabitsModel.aggregate([
        {
          $match: {
            habit_id: new mongoose.Types.ObjectId(habit_id),
            user_id: new mongoose.Types.ObjectId(user.user_id),
            date: { $gte: sevenDaysAgo, $lte: today },
          }
        },
        {
          $lookup: {
            from: 'habits', // Replace with the actual collection name of the habits
            localField: 'habit_id',
            foreignField: '_id',
            as: 'habit'
          }
        },
        {
          $unwind: '$habit' // If habit is an array due to lookup, unwind it to get the object
        },
        {
          $group: {
            _id: "$habit_id",
            habitName: { $first: "$habit.name" },
            isCompleted: { $push: "$isCompleted" },
            dates: { $push: "$date" }
          }
        }
      ]);
  
      if (habitData.length === 0) {
        return res.status(404).json({ message: "Habit data not found." });
      }
  
      res.status(200).json({
        message: "Data found successfully.",
        data: habitData[0], // Since there's only one entry for the habit_id, we access it at index 0
        totalDays: habitData[0].dates.length,
        completedDays: habitData[0].isCompleted.filter(value => value).length,
      });
    } catch (error) {
      console.error("Error fetching habit details:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
};
