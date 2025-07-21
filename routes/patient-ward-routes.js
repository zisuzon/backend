const express = require("express");
const { check } = require("express-validator");

const patientWardController = require("../controllers/patient-ward-controllers");

const router = express.Router();

// POST assign patient to ward
router.post(
  "/assign",
  [
    check("patientId").not().isEmpty().withMessage("Patient ID is required"),
    check("wardId").not().isEmpty().withMessage("Ward ID is required"),
    check("bedNumber")
      .isInt({ min: 1 })
      .withMessage("Bed number must be a positive integer"),
    check("reason")
      .optional()
      .not()
      .isEmpty()
      .withMessage("Reason cannot be empty if provided"),
  ],
  patientWardController.assignPatientToWard
);

// POST transfer patient to different ward
router.post(
  "/transfer",
  [
    check("patientId").not().isEmpty().withMessage("Patient ID is required"),
    check("newWardId").not().isEmpty().withMessage("New ward ID is required"),
    check("bedNumber")
      .isInt({ min: 1 })
      .withMessage("Bed number must be a positive integer"),
    check("reason")
      .optional()
      .not()
      .isEmpty()
      .withMessage("Reason cannot be empty if provided"),
  ],
  patientWardController.transferPatientToWard
);

// POST discharge patient from ward
router.post(
  "/discharge",
  [
    check("patientId").not().isEmpty().withMessage("Patient ID is required"),
    check("reason")
      .optional()
      .not()
      .isEmpty()
      .withMessage("Reason cannot be empty if provided"),
  ],
  patientWardController.dischargePatientFromWard
);

// GET patients by ward
router.get("/ward/:wardId/patients", patientWardController.getPatientsByWard);

// GET ward occupancy details
router.get("/ward/:wardId/occupancy", patientWardController.getWardOccupancy);

// GET patient ward history
router.get(
  "/patient/:patientId/history",
  patientWardController.getPatientWardHistory
);

module.exports = router;
