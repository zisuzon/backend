const express = require("express");
const { check } = require("express-validator");

const doctorTeamsController = require("../controllers/doctor-teams-controllers");

const router = express.Router();

// GET all doctor teams
router.get("/", doctorTeamsController.getDoctorTeams);

// GET doctor team by ID
router.get("/:teamId", doctorTeamsController.getDoctorTeamById);

// POST create new doctor team
router.post(
  "/",
  [
    check("teamName").not().isEmpty().withMessage("Team name is required"),
    check("teamCode").not().isEmpty().withMessage("Team code is required"),
    check("department").not().isEmpty().withMessage("Department is required"),
    check("teamLead").not().isEmpty().withMessage("Team lead is required"),
    check("doctors")
      .optional()
      .isArray()
      .withMessage("Doctors must be an array"),
    check("patients")
      .optional()
      .isArray()
      .withMessage("Patients must be an array"),
    check("isActive")
      .optional()
      .isBoolean()
      .withMessage("Active status must be true or false"),
  ],
  doctorTeamsController.createDoctorTeam
);

// PATCH update doctor team
router.patch(
  "/:teamId",
  [
    check("teamName")
      .optional()
      .not()
      .isEmpty()
      .withMessage("Team name cannot be empty"),
    check("teamCode")
      .optional()
      .not()
      .isEmpty()
      .withMessage("Team code cannot be empty"),
    check("department")
      .optional()
      .not()
      .isEmpty()
      .withMessage("Department cannot be empty"),
    check("teamLead")
      .optional()
      .not()
      .isEmpty()
      .withMessage("Team lead cannot be empty"),
    check("doctors")
      .optional()
      .isArray()
      .withMessage("Doctors must be an array"),
    check("patients")
      .optional()
      .isArray()
      .withMessage("Patients must be an array"),
    check("isActive")
      .optional()
      .isBoolean()
      .withMessage("Active status must be true or false"),
  ],
  doctorTeamsController.updateDoctorTeam
);

// DELETE doctor team
router.delete("/:teamId", doctorTeamsController.deleteDoctorTeam);

// POST add doctor to team
router.post(
  "/:teamId/doctors",
  [check("doctorId").not().isEmpty().withMessage("Doctor ID is required")],
  doctorTeamsController.addDoctorToTeam
);

// DELETE remove doctor from team
router.delete(
  "/:teamId/doctors",
  [check("doctorId").not().isEmpty().withMessage("Doctor ID is required")],
  doctorTeamsController.removeDoctorFromTeam
);

module.exports = router;
