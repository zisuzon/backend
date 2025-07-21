const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Wards = require("../models/wards");

// Get all wards
const getWards = async (req, res, next) => {
  let wards;
  try {
    wards = await Wards.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching wards failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ wards: wards.map((ward) => ward.toObject({ getters: true })) });
};

// Get ward by ID
const getWardById = async (req, res, next) => {
  const wardId = req.params.wardId;

  let ward;
  try {
    ward = await Wards.findById(wardId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find ward.",
      500
    );
    return next(error);
  }

  if (!ward) {
    const error = new HttpError(
      "Could not find ward for the provided id.",
      404
    );
    return next(error);
  }

  // Calculate actual occupied beds based on active patient assignments
  const wardObj = ward.toObject({ getters: true });
  const activePatients = ward.patients.filter((patient) => patient.isActive);
  const actualOccupiedBeds = activePatients.length;

  const wardWithCalculatedOccupancy = {
    ...wardObj,
    totalOccupiedBeds: actualOccupiedBeds,
    availableBeds: wardObj.totalBeds - actualOccupiedBeds,
    occupancyPercentage:
      wardObj.totalBeds > 0
        ? Math.round((actualOccupiedBeds / wardObj.totalBeds) * 100)
        : 0,
  };

  res.json({ ward: wardWithCalculatedOccupancy });
};

// Create new ward
const createWard = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, type, totalBeds, totalOccupiedBeds, wardGender } = req.body;

  const createdWard = new Wards({
    name,
    type,
    totalBeds,
    totalOccupiedBeds,
    wardGender,
  });

  try {
    await createdWard.save();
  } catch (err) {
    const error = new HttpError("Creating ward failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ ward: createdWard.toObject({ getters: true }) });
};

// Update ward
const updateWard = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, type, totalBeds, totalOccupiedBeds, wardGender } = req.body;
  const wardId = req.params.wardId;

  let ward;
  try {
    ward = await Wards.findById(wardId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update ward.",
      500
    );
    return next(error);
  }

  if (!ward) {
    const error = new HttpError(
      "Could not find ward for the provided id.",
      404
    );
    return next(error);
  }

  ward.name = name;
  ward.type = type;
  ward.totalBeds = totalBeds;
  ward.totalOccupiedBeds = totalOccupiedBeds;
  ward.wardGender = wardGender;

  try {
    await ward.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update ward.",
      500
    );
    return next(error);
  }

  res.json({ ward: ward.toObject({ getters: true }) });
};

// Delete ward
const deleteWard = async (req, res, next) => {
  const wardId = req.params.wardId;

  let ward;
  try {
    ward = await Wards.findById(wardId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete ward.",
      500
    );
    return next(error);
  }

  if (!ward) {
    const error = new HttpError(
      "Could not find ward for the provided id.",
      404
    );
    return next(error);
  }

  try {
    await Wards.findByIdAndDelete(wardId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete ward.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Ward deleted successfully." });
};

exports.getWards = getWards;
exports.getWardById = getWardById;
exports.createWard = createWard;
exports.updateWard = updateWard;
exports.deleteWard = deleteWard;
