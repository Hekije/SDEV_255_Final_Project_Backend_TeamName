//setup
const express = require("express");
var cors = require("cors");
//activate
const bodyParser = require("body-parser");
const jwt = require("jwt-simple");
const Course = require("./models/course");
const User = require("./models/user");
const app = express();
app.use(cors());

app.use(express.json());
const router = express.Router();

//creating a new user
router.post("/users", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send("Missing username or password");
  }

  const newUser = await new User({
    uid: req.body.uid,
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
    courses: req.body.courses,
  });
  try {
    await newUser.save();
    console.log(newUser);
    res.status(201).send("User created");
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/auth", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send("Missing username or password");
    return;
  }
  let user = await User.findOne({ username: req.body.username });
  if (!user) {
    res.status(401).json({ error: "Bad Username" });
  } else if (user.password != req.body.password) {
    res.status(401).send("Bad password");
  } else {
    username2 = user.username;
    const token = jwt.encode({ username: user.username }, secret);
    const auth = 1;

    res.json({ username2, token: token, auth: auth });
  }
});

router.get("/users", async (req, res) => {
  if (!req.headers["x-auth"]) {
    return res.status(401).json({ error: "Missing X-Auth" });
  }

  const token = req.headers["x-auth"];
  try {
    const decoded = jwt.decode(token, secret);

    let users = User.find({}, "username status");
    res.json(users);
  } catch (err) {
    res.status(400).send(err);
  }
});

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
