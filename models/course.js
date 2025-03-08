const db = require("../db");

const Course = db.model("Course", {
  title: { type: String, required: true },
  department: { type: String, required: true },
  course_number: { type: String, required: true },
  credits: { type: Number, required: true },
  description: { type: String },
  instructor_ids: [String],
  student_ids: [String],
});

module.exports = Course;
