const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Doctors = require("../models/doctors");

// Get all doctors
const getDoctors = async (req, res, next) => {
  let doctors;
  try {
    doctors = await Doctors.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching doctors failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    doctors: doctors.map((doctor) => doctor.toObject({ getters: true })),
  });
};

// Get doctor by ID
const getDoctorById = async (req, res, next) => {
  const doctorId = req.params.doctorId;

  let doctor;
  try {
    doctor = await Doctors.findById(doctorId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find doctor.",
      500
    );
    return next(error);
  }

  if (!doctor) {
    const error = new HttpError(
      "Could not find doctor for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ doctor: doctor.toObject({ getters: true }) });
};

// Create new doctor
const createDoctor = async (req, res, next) => {
  console.log("createDoctor", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    name,
    licence,
    designation,
    department,
    teamId,
    contact,
    email,
    address,
    isActive,
  } = req.body;

  const createdDoctor = new Doctors({
    name,
    licence,
    designation,
    department,
    teamId,
    contact,
    email,
    address,
    isActive,
  });

  try {
    await createdDoctor.save();
  } catch (err) {
    const error = new HttpError(
      "Creating doctor failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ doctor: createdDoctor.toObject({ getters: true }) });
};

// Update doctor
const updateDoctor = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    name,
    licence,
    designation,
    department,
    teamId,
    contact,
    email,
    address,
    isActive,
  } = req.body;
  const doctorId = req.params.doctorId;

  let doctor;
  try {
    doctor = await Doctors.findById(doctorId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update doctor.",
      500
    );
    return next(error);
  }

  if (!doctor) {
    const error = new HttpError(
      "Could not find doctor for the provided id.",
      404
    );
    return next(error);
  }

  doctor.name = name;
  doctor.licence = licence;
  doctor.designation = designation;
  doctor.department = department;
  doctor.teamId = teamId;
  doctor.contact = contact;
  doctor.email = email;
  doctor.address = address;
  doctor.isActive = isActive;

  try {
    await doctor.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update doctor.",
      500
    );
    return next(error);
  }

  res.json({ doctor: doctor.toObject({ getters: true }) });
};

// Delete doctor
const deleteDoctor = async (req, res, next) => {
  const doctorId = req.params.doctorId;

  let doctor;
  try {
    doctor = await Doctors.findById(doctorId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete doctor.",
      500
    );
    return next(error);
  }

  if (!doctor) {
    const error = new HttpError(
      "Could not find doctor for the provided id.",
      404
    );
    return next(error);
  }

  try {
    await Doctors.findByIdAndDelete(doctorId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete doctor.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Doctor deleted successfully." });
};

exports.getDoctors = getDoctors;
exports.getDoctorById = getDoctorById;
exports.createDoctor = createDoctor;
exports.updateDoctor = updateDoctor;
exports.deleteDoctor = deleteDoctor;
