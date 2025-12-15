const db = require("../utils/db");

class ProjectsController {
  createNewProjectSchema = async (req, res) => {
    try {
      const schemaName = `p_${req.user.id}_${Date.now()}_dev`;

      await db.schema.createSchemaIfNotExists(schemaName);

      return res.json({ ok: true, schemaName });
    } catch (err) {
      console.error("Error happened on server:", err);

      return res.status(500).json({ message: err.message });
    }
  };
}

module.exports = new ProjectsController();
