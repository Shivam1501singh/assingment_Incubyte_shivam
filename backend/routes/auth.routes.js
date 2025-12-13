const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");
const { body, query, param } = require("express-validator");
const validate = require("../middleware/validate.middleware");

router.post("/register",body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars"),
  validate,register);

router.post("/login",body("email").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password required"),
  validate, login);

module.exports = router;
