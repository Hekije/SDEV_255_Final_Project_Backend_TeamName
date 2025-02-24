const db = require("../db");

const Course = db.model("Course", {
  title: { type: String, required: true },
  code: { type: String, required: true },
  description: { String },
  instructor_ids: [String],
  student_ids: [String],
});

module.exports = Course;
