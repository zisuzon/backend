const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const patientSchema = new Schema({
  name: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  gender: { type: String, required: true },
  contact: { type: String, required: true },
  emergencyContact: { type: String, required: false },
  history: { type: String },
  assignedWard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wards",
    required: false,
  },
  assignedWardName: { type: String }, // For quick reference
  bedNumber: { type: Number }, // Specific bed number in the ward
  assignedTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DoctorsTeam",
    required: false,
  },
  assignedTeamName: { type: String }, // For quick reference
  admissionDate: { type: Date, default: Date.now },
  dischargeDate: { type: Date },
  isActive: { type: Boolean, default: true },
  wardHistory: [
    {
      wardId: { type: mongoose.Schema.Types.ObjectId, ref: "Wards" },
      wardName: { type: String },
      bedNumber: { type: Number },
      assignedDate: { type: Date, default: Date.now },
      dischargedDate: { type: Date },
      reason: { type: String }, // Reason for transfer
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt field before saving
patientSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for current ward assignment
patientSchema.virtual("currentWard").get(function () {
  if (this.wardHistory && this.wardHistory.length > 0) {
    const currentAssignment = this.wardHistory[this.wardHistory.length - 1];
    if (!currentAssignment.dischargedDate) {
      return currentAssignment;
    }
  }
  return null;
});

// Virtual for ward assignment duration
patientSchema.virtual("wardAssignmentDuration").get(function () {
  if (this.admissionDate) {
    const now = new Date();
    const admission = new Date(this.admissionDate);
    const diffTime = Math.abs(now - admission);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return 0;
});

// Ensure virtuals are serialized
patientSchema.set("toJSON", { virtuals: true });
patientSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Patients", patientSchema);
