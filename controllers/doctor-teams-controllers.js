const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const DoctorsTeam = require("../models/doctor-team");
const Doctors = require("../models/doctors");
const Patients = require("../models/patients");

// Get all doctor teams
const getDoctorTeams = async (req, res, next) => {
  let teams;
  try {
    teams = await DoctorsTeam.find({})
      .populate("teamLead", "name designation department")
      .populate("doctors", "name designation department")
      .populate("patients", "name gender contact");
  } catch (err) {
    const error = new HttpError(
      "Fetching doctor teams failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ teams: teams.map((team) => team.toObject({ getters: true })) });
};

// Get doctor team by ID
const getDoctorTeamById = async (req, res, next) => {
  const teamId = req.params.teamId;

  let team;
  try {
    team = await DoctorsTeam.findById(teamId)
      .populate("teamLead", "name licence designation department contact email")
      .populate("doctors", "name licence designation department contact email")
      .populate(
        "patients",
        "name dateOfBirth gender contact emergencyContact history"
      );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find doctor team.",
      500
    );
    return next(error);
  }

  if (!team) {
    const error = new HttpError(
      "Could not find doctor team for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ team: team.toObject({ getters: true }) });
};

// Create new doctor team
const createDoctorTeam = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    teamName,
    teamCode,
    department,
    teamLead,
    doctors,
    patients,
    description,
    isActive,
  } = req.body;

  // Validate required fields
  if (!teamName || !teamCode || !department || !teamLead) {
    const error = new HttpError(
      "Team name, team code, department, and team lead are required.",
      422
    );
    return next(error);
  }

  // Validate that teamLead exists and is active
  let teamLeadDoctor;
  try {
    teamLeadDoctor = await Doctors.findById(teamLead);
    if (!teamLeadDoctor) {
      const error = new HttpError("Team lead doctor not found.", 404);
      return next(error);
    }
    if (!teamLeadDoctor.isActive) {
      const error = new HttpError("Team lead doctor is not active.", 422);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError("Invalid team lead doctor ID.", 400);
    return next(error);
  }

  // Validate that all doctors exist and are active
  if (doctors && doctors.length > 0) {
    try {
      const existingDoctors = await Doctors.find({
        _id: { $in: doctors },
        isActive: true,
      });
      if (existingDoctors.length !== doctors.length) {
        const error = new HttpError(
          "One or more doctors not found or inactive.",
          404
        );
        return next(error);
      }

      // Ensure team lead is included in doctors array
      if (!doctors.includes(teamLead)) {
        doctors.push(teamLead);
      }
    } catch (err) {
      const error = new HttpError("Invalid doctor IDs.", 400);
      return next(error);
    }
  } else {
    // If no doctors array provided, include only team lead
    doctors = [teamLead];
  }

  // Validate that all patients exist (if provided)
  if (patients && patients.length > 0) {
    try {
      const existingPatients = await Patients.find({
        _id: { $in: patients },
        isActive: true,
      });
      if (existingPatients.length !== patients.length) {
        const error = new HttpError(
          "One or more patients not found or inactive.",
          404
        );
        return next(error);
      }
    } catch (err) {
      const error = new HttpError("Invalid patient IDs.", 400);
      return next(error);
    }
  }

  // Check if team code already exists
  try {
    const existingTeam = await DoctorsTeam.findOne({ teamCode });
    if (existingTeam) {
      const error = new HttpError("Team code already exists.", 422);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError("Error checking team code uniqueness.", 500);
    return next(error);
  }

  const createdTeam = new DoctorsTeam({
    teamName: teamName.trim(),
    teamCode: teamCode.trim().toUpperCase(),
    department: department.trim(),
    teamLead,
    doctors: doctors || [teamLead],
    patients: patients || [],
    description: description ? description.trim() : "",
    isActive: isActive !== undefined ? isActive : true,
  });

  try {
    await createdTeam.save();
  } catch (err) {
    if (err.code === 11000) {
      const error = new HttpError("Team code already exists.", 422);
      return next(error);
    }
    const error = new HttpError(
      "Creating doctor team failed, please try again.",
      500
    );
    return next(error);
  }

  // Populate the created team before sending response
  await createdTeam.populate(
    "teamLead",
    "name designation department contact email"
  );
  await createdTeam.populate(
    "doctors",
    "name designation department contact email"
  );
  await createdTeam.populate("patients", "name gender contact");

  res.status(201).json({
    team: createdTeam.toObject({ getters: true }),
    message: "Doctor team created successfully!",
  });
};

// Update doctor team
const updateDoctorTeam = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    teamName,
    teamCode,
    department,
    teamLead,
    doctors,
    patients,
    description,
    isActive,
  } = req.body;
  const teamId = req.params.teamId;

  let team;
  try {
    team = await DoctorsTeam.findById(teamId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update doctor team.",
      500
    );
    return next(error);
  }

  if (!team) {
    const error = new HttpError(
      "Could not find doctor team for the provided id.",
      404
    );
    return next(error);
  }

  // Validate teamLead if provided
  if (teamLead) {
    try {
      const teamLeadDoctor = await Doctors.findById(teamLead);
      if (!teamLeadDoctor) {
        const error = new HttpError("Team lead doctor not found.", 404);
        return next(error);
      }
    } catch (err) {
      const error = new HttpError("Invalid team lead doctor ID.", 400);
      return next(error);
    }
  }

  // Validate doctors if provided
  if (doctors && doctors.length > 0) {
    try {
      const existingDoctors = await Doctors.find({ _id: { $in: doctors } });
      if (existingDoctors.length !== doctors.length) {
        const error = new HttpError("One or more doctors not found.", 404);
        return next(error);
      }
    } catch (err) {
      const error = new HttpError("Invalid doctor IDs.", 400);
      return next(error);
    }
  }

  // Validate patients if provided
  if (patients && patients.length > 0) {
    try {
      const existingPatients = await Patients.find({ _id: { $in: patients } });
      if (existingPatients.length !== patients.length) {
        const error = new HttpError("One or more patients not found.", 404);
        return next(error);
      }
    } catch (err) {
      const error = new HttpError("Invalid patient IDs.", 400);
      return next(error);
    }
  }

  team.teamName = teamName || team.teamName;
  team.teamCode = teamCode || team.teamCode;
  team.department = department || team.department;
  team.teamLead = teamLead || team.teamLead;
  team.doctors = doctors || team.doctors;
  team.patients = patients || team.patients;
  team.description = description || team.description;
  team.isActive = isActive !== undefined ? isActive : team.isActive;

  try {
    await team.save();
  } catch (err) {
    if (err.code === 11000) {
      const error = new HttpError("Team code already exists.", 422);
      return next(error);
    }
    const error = new HttpError(
      "Something went wrong, could not update doctor team.",
      500
    );
    return next(error);
  }

  // Populate the updated team before sending response
  await team.populate("teamLead", "name designation department");
  await team.populate("doctors", "name designation department");
  await team.populate("patients", "name gender contact");

  res.json({ team: team.toObject({ getters: true }) });
};

// Delete doctor team
const deleteDoctorTeam = async (req, res, next) => {
  const teamId = req.params.teamId;

  let team;
  try {
    team = await DoctorsTeam.findById(teamId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete doctor team.",
      500
    );
    return next(error);
  }

  if (!team) {
    const error = new HttpError(
      "Could not find doctor team for the provided id.",
      404
    );
    return next(error);
  }

  try {
    await DoctorsTeam.findByIdAndDelete(teamId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete doctor team.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Doctor team deleted successfully." });
};

// Add doctor to team
const addDoctorToTeam = async (req, res, next) => {
  const { doctorId } = req.body;
  const teamId = req.params.teamId;

  if (!doctorId) {
    const error = new HttpError("Doctor ID is required.", 400);
    return next(error);
  }

  let team;
  try {
    team = await DoctorsTeam.findById(teamId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find doctor team.",
      500
    );
    return next(error);
  }

  if (!team) {
    const error = new HttpError(
      "Could not find doctor team for the provided id.",
      404
    );
    return next(error);
  }

  // Check if doctor exists
  let doctor;
  try {
    doctor = await Doctors.findById(doctorId);
    if (!doctor) {
      const error = new HttpError("Doctor not found.", 404);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError("Invalid doctor ID.", 400);
    return next(error);
  }

  // Check if doctor is already in the team
  if (team.doctors.includes(doctorId)) {
    const error = new HttpError("Doctor is already in this team.", 422);
    return next(error);
  }

  team.doctors.push(doctorId);

  try {
    await team.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not add doctor to team.",
      500
    );
    return next(error);
  }

  await team.populate("doctors", "name designation department");

  res.json({ team: team.toObject({ getters: true }) });
};

// Remove doctor from team
const removeDoctorFromTeam = async (req, res, next) => {
  const { doctorId } = req.body;
  const teamId = req.params.teamId;

  if (!doctorId) {
    const error = new HttpError("Doctor ID is required.", 400);
    return next(error);
  }

  let team;
  try {
    team = await DoctorsTeam.findById(teamId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find doctor team.",
      500
    );
    return next(error);
  }

  if (!team) {
    const error = new HttpError(
      "Could not find doctor team for the provided id.",
      404
    );
    return next(error);
  }

  // Check if doctor is in the team
  if (!team.doctors.includes(doctorId)) {
    const error = new HttpError("Doctor is not in this team.", 404);
    return next(error);
  }

  // Remove doctor from team
  team.doctors = team.doctors.filter((id) => id.toString() !== doctorId);

  try {
    await team.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not remove doctor from team.",
      500
    );
    return next(error);
  }

  await team.populate("doctors", "name designation department");

  res.json({ team: team.toObject({ getters: true }) });
};

exports.getDoctorTeams = getDoctorTeams;
exports.getDoctorTeamById = getDoctorTeamById;
exports.createDoctorTeam = createDoctorTeam;
exports.updateDoctorTeam = updateDoctorTeam;
exports.deleteDoctorTeam = deleteDoctorTeam;
exports.addDoctorToTeam = addDoctorToTeam;
exports.removeDoctorFromTeam = removeDoctorFromTeam;
