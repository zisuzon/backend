const express = require("express");
const { check } = require("express-validator");

const wardsController = require("../controllers/wards-controllers");

const router = express.Router();

// GET all wards
router.get("/", wardsController.getWards);

// GET ward by ID
router.get("/:wardId", wardsController.getWardById);

// POST create new ward
router.post(
  "/",
  [
    check("name").not().isEmpty().withMessage("Ward name is required"),
    check("type").not().isEmpty().withMessage("Ward type is required"),
    check("totalBeds")
      .isNumeric()
      .withMessage("Total beds must be a number")
      .isInt({ min: 1 })
      .withMessage("Total beds must be at least 1"),
    check("totalOccupiedBeds")
      .isNumeric()
      .withMessage("Total occupied beds must be a number")
      .isInt({ min: 0 })
      .withMessage("Total occupied beds cannot be negative"),
    check("wardGender")
      .not()
      .isEmpty()
      .withMessage("Ward gender is required")
      .isIn(["Male", "Female", "Mixed"])
      .withMessage("Ward gender must be Male, Female, or Mixed"),
  ],
  wardsController.createWard
);

// PATCH update ward
router.patch(
  "/:wardId",
  [
    check("name").not().isEmpty().withMessage("Ward name is required"),
    check("type").not().isEmpty().withMessage("Ward type is required"),
    check("totalBeds")
      .isNumeric()
      .withMessage("Total beds must be a number")
      .isInt({ min: 1 })
      .withMessage("Total beds must be at least 1"),
    check("totalOccupiedBeds")
      .isNumeric()
      .withMessage("Total occupied beds must be a number")
      .isInt({ min: 0 })
      .withMessage("Total occupied beds cannot be negative"),
    check("wardGender")
      .not()
      .isEmpty()
      .withMessage("Ward gender is required")
      .isIn(["Male", "Female", "Mixed"])
      .withMessage("Ward gender must be Male, Female, or Mixed"),
  ],
  wardsController.updateWard
);

// DELETE ward
router.delete("/:wardId", wardsController.deleteWard);

module.exports = router;
