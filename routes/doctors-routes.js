const express = require("express");
const { check } = require("express-validator");

const doctorsController = require("../controllers/doctors-controllers");

const router = express.Router();

// GET all doctors
router.get("/", doctorsController.getDoctors);

// GET doctor by ID
router.get("/:doctorId", doctorsController.getDoctorById);

// POST create new doctor
router.post(
  "/",
  [
    check("name").not().isEmpty().withMessage("Doctor name is required"),
    check("licence").not().isEmpty().withMessage("Medical licence is required"),
    check("designation").not().isEmpty().withMessage("Designation is required"),
    check("department").not().isEmpty().withMessage("Department is required"),
    check("contact").not().isEmpty().withMessage("Contact number is required"),
    check("email")
      .normalizeEmail()
      .isEmail()
      .withMessage("Valid email is required"),
    check("address").not().isEmpty().withMessage("Address is required"),
    check("isActive")
      .isBoolean()
      .withMessage("Active status must be true or false"),
  ],
  doctorsController.createDoctor
);

// PATCH update doctor
router.patch(
  "/:doctorId",
  [
    check("name").not().isEmpty().withMessage("Doctor name is required"),
    check("licence").not().isEmpty().withMessage("Medical licence is required"),
    check("designation").not().isEmpty().withMessage("Designation is required"),
    check("department").not().isEmpty().withMessage("Department is required"),
    check("contact").not().isEmpty().withMessage("Contact number is required"),
    check("email")
      .normalizeEmail()
      .isEmail()
      .withMessage("Valid email is required"),
    check("address").not().isEmpty().withMessage("Address is required"),
    check("isActive")
      .isBoolean()
      .withMessage("Active status must be true or false"),
  ],
  doctorsController.updateDoctor
);

// DELETE doctor
router.delete("/:doctorId", doctorsController.deleteDoctor);

module.exports = router;
