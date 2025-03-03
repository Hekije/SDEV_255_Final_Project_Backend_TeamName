const db = require("../db");

const User = db.model("User", {
  uid: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher"], required: true },
  courses: [{ type: String }],
});

module.exports = User;
