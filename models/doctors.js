const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const doctorsSchema = new Schema({
  name: { type: String, required: true },
  licence: { type: String, required: true },
  designation: { type: String, required: true },
  department: { type: String, required: true },
  teamId: { type: String, required: false },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  isActive: { type: Boolean, required: true },
});

module.exports = mongoose.model("Doctors", doctorsSchema);
