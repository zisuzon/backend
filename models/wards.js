const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const wardsSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  totalBeds: { type: Number, required: true },
  totalOccupiedBeds: { type: Number, required: true },
  wardGender: { type: String, required: true },
  patients: [
    {
      patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patients" },
      bedNumber: { type: Number, required: true },
      admissionDate: { type: Date, default: Date.now },
      isActive: { type: Boolean, default: true },
    },
  ],
  description: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt field and recalculate occupied beds before saving
wardsSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Recalculate totalOccupiedBeds based on active patients
  this.totalOccupiedBeds = this.patients.filter(
    (patient) => patient.isActive
  ).length;

  next();
});

// Virtual for available beds
wardsSchema.virtual("availableBeds").get(function () {
  return this.totalBeds - this.totalOccupiedBeds;
});

// Virtual for occupancy percentage
wardsSchema.virtual("occupancyPercentage").get(function () {
  if (this.totalBeds > 0) {
    return Math.round((this.totalOccupiedBeds / this.totalBeds) * 100);
  }
  return 0;
});

// Virtual for occupied bed numbers
wardsSchema.virtual("occupiedBedNumbers").get(function () {
  return this.patients
    ?.filter((patient) => patient.isActive)
    ?.map((patient) => patient.bedNumber);
});

// Virtual for available bed numbers
wardsSchema.virtual("availableBedNumbers").get(function () {
  const occupiedBeds = this.occupiedBedNumbers;
  const allBeds = Array.from({ length: this.totalBeds }, (_, i) => i + 1);
  return allBeds?.filter((bedNumber) => !occupiedBeds?.includes(bedNumber));
});

// Method to assign patient to ward
wardsSchema.methods.assignPatient = function (patientId, bedNumber) {
  if (this.totalOccupiedBeds >= this.totalBeds) {
    throw new Error("Ward is full");
  }

  if (this.occupiedBedNumbers.includes(bedNumber)) {
    throw new Error(`Bed ${bedNumber} is already occupied`);
  }

  this.patients.push({
    patientId: patientId,
    bedNumber: bedNumber,
    admissionDate: new Date(),
    isActive: true,
  });

  // Recalculate totalOccupiedBeds based on active patients
  this.totalOccupiedBeds = this.patients.filter(
    (patient) => patient.isActive
  ).length;
  return this;
};

// Method to discharge patient from ward
wardsSchema.methods.dischargePatient = function (patientId) {
  const patientIndex = this.patients.findIndex(
    (patient) =>
      patient.patientId.toString() === patientId.toString() && patient.isActive
  );

  if (patientIndex === -1) {
    throw new Error("Patient not found in this ward");
  }

  this.patients[patientIndex].isActive = false;

  // Recalculate totalOccupiedBeds based on active patients
  this.totalOccupiedBeds = this.patients.filter(
    (patient) => patient.isActive
  ).length;
  return this;
};

// Method to transfer patient within ward
wardsSchema.methods.transferPatient = function (patientId, newBedNumber) {
  if (this.occupiedBedNumbers.includes(newBedNumber)) {
    throw new Error(`Bed ${newBedNumber} is already occupied`);
  }

  const patientIndex = this.patients.findIndex(
    (patient) =>
      patient.patientId.toString() === patientId.toString() && patient.isActive
  );

  if (patientIndex === -1) {
    throw new Error("Patient not found in this ward");
  }

  this.patients[patientIndex].bedNumber = newBedNumber;
  return this;
};

// Ensure virtuals are serialized
wardsSchema.set("toJSON", { virtuals: true });
wardsSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Wards", wardsSchema);
