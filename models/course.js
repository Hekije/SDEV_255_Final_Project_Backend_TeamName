const db = require("../db");

const Course = db.model("Course", {
  title: { type: String, required: true },
  department: { type: String, required: true },
  course_number: { type: Number, required: true },
  credits: { type: Number, required: true },
  description: { String },
  instructor_ids: [String],
  student_ids: [String],
});

module.exports = Course;
