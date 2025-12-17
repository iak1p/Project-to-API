const db = require("../utils/db");

class ProjectsController {
  createNewProjectSchema = async (req, res) => {
    const user = req.user;

    try {
      const schemaName = `p_${req.user.id}_${Date.now()}_dev`;

      await db.schema.createSchemaIfNotExists(schemaName);

      const [workspace] = await db("workspaces")
        .insert({
          name: schemaName,
          slug: schemaName,
          schemaName: schemaName,
          ownerId: user.id,
        })
        .returning("*");

      await db("user_workspaces").insert({
        user_id: user.id,
        workspace_id: workspace.id,
      });

      return res.status(200).json({
        workspace: workspace,
        schemaName: schemaName,
      });
    } catch (err) {
      console.error("Error happened on server:", err);

      return res.status(500).json({ message: err.message });
    }
  };

  createNewTable = async () => {
    try {
    } catch (err) {
      console.error("Error happened on server:", err);

      return res.status(500).json({ message: err.message });
    }
  };
}

module.exports = new ProjectsController();
