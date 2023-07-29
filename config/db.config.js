// Require the library
const mongoose = require('mongoose');
const username = process.env.DATABASE_USERNAME;
const password =process.env.DATABASE_PASSWORD;
const cluster =process.env.CLUSTER_NAME;
const databaseName =process.env.DATABASE_NAME;

const options = {
  user: username,
  pass: password,
  dbName: databaseName,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority',
};
mongoose.connect(`mongodb+srv://${cluster}.czmc1rn.mongodb.net/`, options);


// Acquire the database
const connection = mongoose.connection;

// Connecting error
connection.on('error',console.error.bind(console,"error in database connection"))

// Successful connection
connection.once('open',function(){console.log("Database connected successfully!")})

