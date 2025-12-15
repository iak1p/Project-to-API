const { Router } = require("express");
const passport = require("passport");

const router = new Router();

//Import controllers
const AuthController = require("../controllers/auth.controller");

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", AuthController.login);

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post("/register", AuthController.register);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  AuthController.me
);

module.exports = router;
