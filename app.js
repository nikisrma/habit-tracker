const express = require("express");
const app = express();
const port = 5001;
const bodyParser = require("body-parser");
const expressEjsLayouts = require("express-ejs-layouts");
require("dotenv").config();
require("./config/db.config");
var path = require("path");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressEjsLayouts);
app.set("layout", "layout");
// use express router
app.use("/", require("./routes"));
app.use("/api", require("./routes/users"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }

  console.log(`Server is running on port: ${port}`);
});
