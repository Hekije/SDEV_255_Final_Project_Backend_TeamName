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
const secret = "mostsecretysecret";

//creating a new user
router.post("/users", async (req, res) => {
  const usernameExists = await User.findOne({ username: req.body.username });

  if (!req.body.username || !req.body.password) {
    res.status(400).send("Missing username or password");
  } else if (usernameExists) {
    res.status(400).send("Username unavailable");
  } else {
    const newUser = await new User({
      username: req.body.username,
      password: req.body.password,
      role: req.body.role,
    });
    try {
      await newUser.save();
      console.log(newUser);
      res.status(201).send(newUser);
    } catch (err) {
      res.status(400).send(err);
    }
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
    console.log(user);
    const id = user._id;
    const username2 = user.username;
    const token = jwt.encode({ username: user.username }, secret);
    const auth = 1;
    const role = user.role;

    res.json({
      id: id,
      username2: username2,
      token: token,
      auth: auth,
      role: role,
    });
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
    console.log(router);
  } catch (err) {
    console.log(err);
  }
});

//get all courses not already on a student's schedule
router.get("/courses/student/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    const courseList = user.courses;
    console.log([courseList]);
    const courses = await Course.find({
      _id: { $nin: courseList },
    });
    console.log(courses);
    res.json(courses);
  } catch (err) {
    res.status(400).send(err);
  }
});

//get added courses by student id
router.get("/courses/student/schedule/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    const courseList = user.courses;
    console.log([courseList]);
    const courses = await Course.find({
      _id: { $in: courseList },
    });
    console.log(courses);
    res.json(courses);
  } catch (err) {
    res.status(400).send(err);
  }
});

//get courses by teacher id
router.get("/courses/teacher/:id", async (req, res) => {
  try {
    const courses = await Course.find({
      instructor_ids: { $in: [req.params.id] },
    });
    res.json(courses);
  } catch (err) {
    res.status(400).send(err);
  }
});

//get a course by id
router.get("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.json(course);
    console.log(course);
  } catch (err) {
    res.status(400).send(err);
  }
});

//get a user by id
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

//update user
router.put("/users/:id", async (req, res) => {
  try {
    const user = req.body;
    await User.updateOne({ _id: req.params.id }, user);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).send(err);
  }
});

//add a course
router.post("/courses", async (req, res) => {
  try {
    const course = new Course(req.body);
    console.log(req.body);
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
    res.sendStatus(204);
  } catch (err) {
    res.status(400).send(err);
  }
});

//delete a course
router.delete("/courses/:id", async (req, res) => {
  try {
    await Course.deleteOne({ _id: req.params.id });
    res.status(204).end();
  } catch (err) {
    res.status(400).send(err);
  }
});

app.use("/api", router);
app.listen(3000);
