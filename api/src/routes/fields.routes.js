const { Router } = require("express");
const passport = require("passport");

const router = new Router();

//Import controllers
const FieldsController = require("../controllers/fields.controller");

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  FieldsController.createField
);

// router.get(
//   "/:modelId",
//   passport.authenticate("jwt", { session: false }),
//   ModelsController.getById
// );

// router.delete(
//   "/:modelId",
//   passport.authenticate("jwt", { session: false }),
//   ModelsController.deleteModelById
// );

module.exports = router;
