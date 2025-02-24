//setup
const express = require("express");
var cors = require("cors");
//activate
const bodyParser = require("body-parser");
const Course = require("./models/course");
const app = express();
app.use(cors());

app.use(express.json());
const router = express.Router();

//get all courses
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find({});
    res.send(courses);
    console.log(courses);
  } catch (err) {
    console.log(err);
  }
});

//get a course by id
router.get("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.json(course);
  } catch (err) {
    res.status(400).send(err);
  }
});

//add a course
router.post("/courses", async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400);
    console.log(err);
  }
});

//update a course
router.put("/courses/:id", async (req, res) => {
  try {
    const course = req.body;
    await Course.updateOne({ _id: req.params.id }, course);
    console.log(course);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).send(err);
  }
});

//delete a course
router.delete("/courses/:id", async (req, res) => {
  try {
    await Course.deleteOne({ _id: req.params.id });
    res.sendStatus(204);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.use("/api", router);
app.listen(3000);
