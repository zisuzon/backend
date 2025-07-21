const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const doctorsTeamSchema = new Schema({
  teamName: {
    type: String,
    required: true,
    trim: true,
  },
  teamCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  teamLead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctors",
    required: true,
  },
  doctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctors",
      required: true,
    },
  ],
  patients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patients",
      required: false,
    },
  ],
  description: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
doctorsTeamSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for team size (number of doctors)
doctorsTeamSchema.virtual("teamSize").get(function () {
  return this.doctors ? this.doctors.length : 0;
});

// Virtual for patient count
doctorsTeamSchema.virtual("patientCount").get(function () {
  return this.patients ? this.patients.length : 0;
});

// Ensure virtuals are serialized
doctorsTeamSchema.set("toJSON", { virtuals: true });
doctorsTeamSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("DoctorsTeam", doctorsTeamSchema);
