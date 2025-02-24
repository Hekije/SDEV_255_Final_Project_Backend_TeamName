const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://shorban1:XB13qsTjBUDn1sqM@courses.sicqm.mongodb.net/?retryWrites=true&w=majority&appName=courses",
  { useNewUrlParser: true }
);

module.exports = mongoose;
