const { Router } = require("express");
const passport = require("passport");

const router = new Router();

//Import controllers
const ModelsController = require("../controllers/models.controller");

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  ModelsController.createModel
);

router.get(
  "/:modelId",
  passport.authenticate("jwt", { session: false }),
  ModelsController.getById
);

router.delete(
  "/:modelId",
  passport.authenticate("jwt", { session: false }),
  ModelsController.deleteModelById
);

module.exports = router;
