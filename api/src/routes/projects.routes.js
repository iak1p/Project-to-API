const { Router } = require("express");
const passport = require("passport");

const router = new Router();

//Import controllers
const ProjectsController = require("../controllers/projects.controller");

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  ProjectsController.createNewProjectSchema
);

module.exports = router;
