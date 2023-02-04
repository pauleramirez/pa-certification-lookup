const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const PORT = 6000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const lookupController = require("./controllers/lookupController");

//in production, serve the build folder
app.use(express.static(path.join(__dirname, "../build")));

app.get("/", (req, res) => {
  console.log("made a get request");
  res.json("Hello World!");
});

app.post("/api/lookup", lookupController.lookup, (req, res) => {
  res.status(200).json(res.locals.teacherArray);
});

app.listen(PORT, () => {
  console.log(`PA Certification listening on port ${PORT}`);
});
