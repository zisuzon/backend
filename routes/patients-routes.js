const express = require("express");
const { check } = require("express-validator");

const patientsControllers = require("../controllers/paitents-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// Public APIs
router.get("/", patientsControllers.getPatients);
router.get("/:pid", patientsControllers.getPatientById);

router.use(checkAuth);

router.post(
  "/",
  [
    check("name").not().isEmpty(),
    check("dateOfBirth").not().isEmpty(),
    check("gender").not().isEmpty(),
    check("contact").not().isEmpty(),
  ],
  patientsControllers.createPatient
);

router.patch(
  "/:pid",
  [
    check("name").not().isEmpty(),
    check("dateOfBirth").not().isEmpty(),
    check("gender").not().isEmpty(),
    check("contact").not().isEmpty(),
  ],
  patientsControllers.updatePatient
);

router.delete("/:pid", patientsControllers.deletePatient);

module.exports = router;
