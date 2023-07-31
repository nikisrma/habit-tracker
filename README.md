# habit-tracker

Clone the repository to your local machine.
Run npm install to install all the required dependencies.

Set up your MongoDB connection by providing the appropriate credentials and database information in the config/db.config.js file.
Create a .env file in the root directory and define the required environment variables as needed.

**Dependencies**
  express
  body-parser
  dotenv
  ejs
  express-ejs-layouts
  mongoose

  
To run the application, execute **npm start**

The server will start running on port 5001.

**Routes**

/: This is the default route that renders the home page using the EJS view.
/api: This route is for handling API requests and is defined in the ./routes/users.js file. You can add more API routes as needed.

# User Routes Readme

This is the list of routes for handling user-related functionality in the Express.js application.

## Register User
### Route: `/register`
- Method: POST
- Description: Register a new user.

## Login User
### Route: `/login`
- Method: POST
- Description: Login an existing user.


- Middleware: `authMiddleware` (Authentication middleware to ensure the user is logged in.)
- 
## Add Default Habit
### Route: `/add-default-habit`
- Method: POST
- Description: Add a default habit for the authenticated user.

## Add Habit
### Route: `/add-habit`
- Method: POST
- Description: Add a new custom habit for the authenticated user.
- Request Body:
  - `habitName`: Name of the custom habit to be added.

## Get Habits List
### Route: `/get-list`
- Method: POST
- Description: Get the list of habits for the authenticated user.

## Change Habit Status
### Route: `/change-habit-status`
- Method: POST
- Description: Change the status of a habit for the authenticated user (Completed or Not Completed).
- Request Body:
  - `habitId`: ID of the habit to be updated.
  - `isCompleted`: New status of the habit (true for Completed, false for Not Completed).

## Get Habits Last 7 Days
### Route: `/seven-day-data`
- Method: POST
- Description: Get the data for a habit for the last 7 days for the authenticated user.
- Request Body:
  - `habitId`: ID of the habit to fetch data for.
