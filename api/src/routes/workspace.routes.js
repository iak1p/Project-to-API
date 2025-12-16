const { Router } = require("express");
const passport = require("passport");

const router = new Router();

//Import controllers
const WorkspaceController = require("../controllers/workspace.controller");

router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  WorkspaceController.getAll
);

router.get(
  "/:workspaceId",
  passport.authenticate("jwt", { session: false }),
  WorkspaceController.getById
);

router.get(
  "/user/owner",
  passport.authenticate("jwt", { session: false }),
  WorkspaceController.getUserWorkspace
);

router.get(
  "/user/all",
  passport.authenticate("jwt", { session: false }),
  WorkspaceController.getAllUserWorkspaces
);

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  WorkspaceController.createWorkspace
);

module.exports = router;
