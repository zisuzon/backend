const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Patients = require("../models/patients");
const Wards = require("../models/wards");

// Assign patient to ward
const assignPatientToWard = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { patientId, wardId, bedNumber, reason } = req.body;

  let patient;
  try {
    patient = await Patients.findById(patientId);
  } catch (err) {
    const error = new HttpError("Invalid patient ID.", 400);
    return next(error);
  }

  if (!patient) {
    const error = new HttpError("Patient not found.", 404);
    return next(error);
  }

  let ward;
  try {
    ward = await Wards.findById(wardId);
  } catch (err) {
    const error = new HttpError("Invalid ward ID.", 400);
    return next(error);
  }

  if (!ward) {
    const error = new HttpError("Ward not found.", 404);
    return next(error);
  }

  // Check if patient is already assigned to a ward
  if (patient.assignedWard) {
    const error = new HttpError("Patient is already assigned to a ward.", 422);
    return next(error);
  }

  try {
    // Assign patient to ward
    ward.assignPatient(patientId, bedNumber);
    await ward.save();

    // Update patient record
    patient.assignedWard = wardId;
    patient.assignedWardName = ward.name;
    patient.bedNumber = bedNumber;
    patient.admissionDate = new Date();

    // Add to ward history
    patient.wardHistory.push({
      wardId: wardId,
      wardName: ward.name,
      bedNumber: bedNumber,
      assignedDate: new Date(),
      reason: reason || "Initial admission",
    });

    await patient.save();

    // Populate the updated patient
    await patient.populate(
      "assignedWard",
      "name type totalBeds totalOccupiedBeds wardGender"
    );
    await patient.populate("assignedTeam", "teamName teamCode department");
  } catch (err) {
    const error = new HttpError(err.message, 422);
    return next(error);
  }

  res.json({
    message: "Patient assigned to ward successfully.",
    patient: patient.toObject({ getters: true }),
    ward: ward.toObject({ getters: true }),
  });
};

// Transfer patient to different ward
const transferPatientToWard = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { patientId, newWardId, bedNumber, reason } = req.body;

  let patient;
  try {
    patient = await Patients.findById(patientId).populate("assignedWard");
  } catch (err) {
    const error = new HttpError("Invalid patient ID.", 400);
    return next(error);
  }

  if (!patient) {
    const error = new HttpError("Patient not found.", 404);
    return next(error);
  }

  if (!patient.assignedWard) {
    const error = new HttpError(
      "Patient is not currently assigned to any ward.",
      422
    );
    return next(error);
  }

  let newWard;
  try {
    newWard = await Wards.findById(newWardId);
  } catch (err) {
    const error = new HttpError("Invalid new ward ID.", 400);
    return next(error);
  }

  if (!newWard) {
    const error = new HttpError("New ward not found.", 404);
    return next(error);
  }

  try {
    // Discharge from current ward
    const currentWard = await Wards.findById(patient.assignedWard);
    if (currentWard) {
      currentWard.dischargePatient(patientId);
      await currentWard.save();
    }

    // Update previous ward history entry
    if (patient.wardHistory.length > 0) {
      const lastEntry = patient.wardHistory[patient.wardHistory.length - 1];
      if (!lastEntry.dischargedDate) {
        lastEntry.dischargedDate = new Date();
      }
    }

    // Assign to new ward
    newWard.assignPatient(patientId, bedNumber);
    await newWard.save();

    // Update patient record
    patient.assignedWard = newWardId;
    patient.assignedWardName = newWard.name;
    patient.bedNumber = bedNumber;

    // Add new ward history entry
    patient.wardHistory.push({
      wardId: newWardId,
      wardName: newWard.name,
      bedNumber: bedNumber,
      assignedDate: new Date(),
      reason: reason || "Ward transfer",
    });

    await patient.save();

    // Populate the updated patient
    await patient.populate(
      "assignedWard",
      "name type totalBeds totalOccupiedBeds wardGender"
    );
    await patient.populate("assignedTeam", "teamName teamCode department");
  } catch (err) {
    const error = new HttpError(err.message, 422);
    return next(error);
  }

  res.json({
    message: "Patient transferred successfully.",
    patient: patient.toObject({ getters: true }),
    newWard: newWard.toObject({ getters: true }),
  });
};

// Discharge patient from ward
const dischargePatientFromWard = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { patientId, reason } = req.body;

  let patient;
  try {
    patient = await Patients.findById(patientId).populate("assignedWard");
  } catch (err) {
    const error = new HttpError("Invalid patient ID.", 400);
    return next(error);
  }

  if (!patient) {
    const error = new HttpError("Patient not found.", 404);
    return next(error);
  }

  if (!patient.assignedWard) {
    const error = new HttpError(
      "Patient is not currently assigned to any ward.",
      422
    );
    return next(error);
  }

  try {
    // Discharge from current ward
    const currentWard = await Wards.findById(patient.assignedWard);
    if (currentWard) {
      currentWard.dischargePatient(patientId);
      await currentWard.save();
    }

    // Update ward history entry
    if (patient.wardHistory.length > 0) {
      const lastEntry = patient.wardHistory[patient.wardHistory.length - 1];
      if (!lastEntry.dischargedDate) {
        lastEntry.dischargedDate = new Date();
      }
    }

    // Update patient record
    patient.assignedWard = null;
    patient.assignedWardName = null;
    patient.bedNumber = null;
    patient.dischargeDate = new Date();
    patient.isActive = false;

    await patient.save();

    // Populate the updated patient
    await patient.populate("assignedTeam", "teamName teamCode department");
  } catch (err) {
    const error = new HttpError(err.message, 422);
    return next(error);
  }

  res.json({
    message: "Patient discharged successfully.",
    patient: patient.toObject({ getters: true }),
  });
};

// Get patients by ward
const getPatientsByWard = async (req, res, next) => {
  const wardId = req.params.wardId;

  let ward;
  try {
    ward = await Wards.findById(wardId).populate("patients.patientId");
  } catch (err) {
    const error = new HttpError("Invalid ward ID.", 400);
    return next(error);
  }

  if (!ward) {
    const error = new HttpError("Ward not found.", 404);
    return next(error);
  }

  const activePatients = ward.patients.filter((patient) => patient.isActive);

  res.json({
    ward: ward.toObject({ getters: true }),
    patients: activePatients.map((patient) => ({
      ...patient.patientId.toObject({ getters: true }),
      bedNumber: patient.bedNumber,
      admissionDate: patient.admissionDate,
    })),
  });
};

// Get ward occupancy details
const getWardOccupancy = async (req, res, next) => {
  const wardId = req.params.wardId;

  let ward;
  try {
    ward = await Wards.findById(wardId).populate("patients.patientId");
  } catch (err) {
    const error = new HttpError("Invalid ward ID.", 400);
    return next(error);
  }

  if (!ward) {
    const error = new HttpError("Ward not found.", 404);
    return next(error);
  }

  const activePatients = ward.patients.filter((patient) => patient.isActive);

  res.json({
    ward: ward.toObject({ getters: true }),
    occupancy: {
      totalBeds: ward.totalBeds,
      occupiedBeds: ward.totalOccupiedBeds,
      availableBeds: ward.availableBeds,
      occupancyPercentage: ward.occupancyPercentage,
      occupiedBedNumbers: ward.occupiedBedNumbers,
      availableBedNumbers: ward.availableBedNumbers,
    },
    patients: activePatients.map((patient) => ({
      ...patient.patientId.toObject({ getters: true }),
      bedNumber: patient.bedNumber,
      admissionDate: patient.admissionDate,
    })),
  });
};

// Get patient ward history
const getPatientWardHistory = async (req, res, next) => {
  const patientId = req.params.patientId;

  let patient;
  try {
    patient = await Patients.findById(patientId);
  } catch (err) {
    const error = new HttpError("Invalid patient ID.", 400);
    return next(error);
  }

  if (!patient) {
    const error = new HttpError("Patient not found.", 404);
    return next(error);
  }

  res.json({
    patient: {
      id: patient.id,
      name: patient.name,
      currentWard: patient.currentWard,
    },
    wardHistory: patient.wardHistory,
  });
};

exports.assignPatientToWard = assignPatientToWard;
exports.transferPatientToWard = transferPatientToWard;
exports.dischargePatientFromWard = dischargePatientFromWard;
exports.getPatientsByWard = getPatientsByWard;
exports.getWardOccupancy = getWardOccupancy;
exports.getPatientWardHistory = getPatientWardHistory;
