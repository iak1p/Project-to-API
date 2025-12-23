const { Router } = require("express");
const passport = require("passport");
const db = require('../utils/db');

const router = new Router();

//Import controllers
const WorkspaceController = require("../controllers/workspace.controller");

// Test endpoint (no auth) - MUST be before /:workspaceId
router.get('/test-deploy', async (req, res) => {
  try {
    const models = await db('models').where({ workspaceId: 3 });

    if (!models || models.length === 0) {
      return res.status(404).json({ message: 'No models found for workspace 3' });
    }

    const fields = await db('fields').where({ modelId: models[0].id });

    console.log('Models:', models);
    console.log('Fields:', fields);

    res.json({ models, fields });
  } catch (err) {
    console.error('Test deploy error:', err);
    res.status(500).json({ error: err.message });
  }
});

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

router.post(
  "/:workspaceId/deploy",
  passport.authenticate("jwt", { session: false }),
  WorkspaceController.deployWorkspace
);

module.exports = router;
