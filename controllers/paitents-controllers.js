const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Patients = require("../models/patients");

const getPatients = async (req, res, next) => {
  let patients;
  try {
    patients = await Patients.find({})
      .populate({
        path: "assignedWard",
        select: "name type wardGender totalBeds totalOccupiedBeds",
        model: "Wards",
      })
      .populate({
        path: "assignedTeam",
        select: "teamName teamCode department teamLead",
        model: "DoctorsTeam",
      });
  } catch (err) {
    const error = new HttpError(
      "Fetching patients failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    patients: patients.map((patient) => patient.toObject({ getters: true })),
  });
};

const getPatientById = async (req, res, next) => {
  const patientId = req.params.pid;

  let patient;
  try {
    patient = await Patients.findById(patientId)
      .populate(
        "assignedWard",
        "name type wardGender totalBeds totalOccupiedBeds"
      )
      .populate(
        "assignedTeam",
        "teamName teamCode department teamLead doctors"
      );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the patient.",
      500
    );
    return next(error);
  }

  if (!patient) {
    const error = new HttpError(
      "Could not find the patient for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ patient: patient.toObject({ getters: true }) });
};

const createPatient = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    name,
    dateOfBirth,
    gender,
    contact,
    emergencyContact,
    history,
    assignedWard,
    assignedTeam,
  } = req.body;

  const createdPatient = new Patients({
    name,
    dateOfBirth,
    gender,
    contact,
    emergencyContact,
    history,
    assignedWard,
    assignedTeam,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await createdPatient.save({ session: sess });

    debugger;

    // If patient is assigned to a ward, update the ward's patients array
    if (assignedWard) {
      const Wards = require("../models/wards");
      const ward = await Wards.findById(assignedWard);

      if (ward) {
        debugger;
        // Add patient to ward's patients array
        ward.patients.push({
          patientId: createdPatient._id,
          bedNumber: 1, // Default bed number
          admissionDate: new Date(),
          isActive: true,
        });

        // Update totalOccupiedBeds
        ward.totalOccupiedBeds = (ward.totalOccupiedBeds || 0) + 1;

        await ward.save({ session: sess });
      }
    }

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating patient failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ patient: createdPatient });
};

const updatePatient = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    name,
    dateOfBirth,
    gender,
    contact,
    emergencyContact,
    history,
    assignedWard,
    assignedTeam,
  } = req.body;

  const patientId = req.params.pid;

  let patient;

  try {
    patient = await Patients.findById(patientId);

    if (!patient) {
      const error = new HttpError("Could not find the patient.", 401);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update patient.",
      500
    );
    return next(error);
  }

  const oldWardId = patient.assignedWard;
  const newWardId = assignedWard;

  patient.name = name;
  patient.dateOfBirth = dateOfBirth;
  patient.gender = gender;
  patient.contact = contact;
  patient.emergencyContact = emergencyContact;
  patient.history = history;
  patient.assignedWard = assignedWard;
  patient.assignedTeam = assignedTeam;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await patient.save({ session: sess });

    // Handle ward assignment changes
    const Wards = require("../models/wards");

    // If patient was previously assigned to a ward, remove from that ward
    if (oldWardId && oldWardId.toString() !== newWardId) {
      const oldWard = await Wards.findById(oldWardId);
      if (oldWard) {
        oldWard.patients = oldWard.patients.filter(
          (p) => p.patientId.toString() !== patientId
        );
        // Decrease totalOccupiedBeds
        oldWard.totalOccupiedBeds = Math.max(
          0,
          (oldWard.totalOccupiedBeds || 0) - 1
        );
        await oldWard.save({ session: sess });
      }
    }

    // If patient is now assigned to a new ward, add to that ward
    if (newWardId && (!oldWardId || oldWardId.toString() !== newWardId)) {
      const newWard = await Wards.findById(newWardId);
      if (newWard) {
        // Check if patient is already in the ward's patients array
        const existingPatient = newWard.patients.find(
          (p) => p.patientId.toString() === patientId
        );

        if (!existingPatient) {
          newWard.patients.push({
            patientId: patient._id,
            bedNumber: 1, // Default bed number
            admissionDate: new Date(),
            isActive: true,
          });
          // Increase totalOccupiedBeds
          newWard.totalOccupiedBeds = (newWard.totalOccupiedBeds || 0) + 1;
          await newWard.save({ session: sess });
        }
      }
    }

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update patient.",
      500
    );
    return next(error);
  }

  res.status(200).json({ patient: patient.toObject({ getters: true }) });
};

const deletePatient = async (req, res, next) => {
  const patientId = req.params.pid;

  let patient;
  try {
    patient = await Patients.findById(patientId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete patient.",
      500
    );
    return next(error);
  }

  if (!patient) {
    const error = new HttpError("Could not find patient for this id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    // If patient is assigned to a ward, remove from ward's patients array
    if (patient.assignedWard) {
      const Wards = require("../models/wards");
      const ward = await Wards.findById(patient.assignedWard);
      if (ward) {
        ward.patients = ward.patients.filter(
          (p) => p.patientId.toString() !== patientId
        );
        // Decrease totalOccupiedBeds
        ward.totalOccupiedBeds = Math.max(0, (ward.totalOccupiedBeds || 0) - 1);
        await ward.save({ session: sess });
      }
    }

    await patient.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not discharged patient.",
      500
    );
    return next(error);
  }

  res
    .status(200)
    .json({ message: `${patient.name} has been discharged successfully!` });
};

exports.getPatientById = getPatientById;
exports.getPatients = getPatients;
exports.createPatient = createPatient;
exports.updatePatient = updatePatient;
exports.deletePatient = deletePatient;
