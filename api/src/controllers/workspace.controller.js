const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../utils/db");
const { buildCreateTableSQL } = require("../utils/schemaGenerator");

class WorkspaceController {
  getAll = async (req, res) => {
    try {
      const workspaces = await db("workspaces");
      return res.status(200).json({
        workspaces: workspaces,
      });
    } catch (err) {
      console.error("Error happened on server:", err);

      return res.status(500).json({ message: err.message });
    }
  };

  getById = async (req, res) => {
    const { workspaceId } = req.params ?? {};

    if (!workspaceId)
      return res.status(400).json({ message: "workspaceId is required" });

    try {
      const workspace = await db("workspaces")
        .where({ id: workspaceId })
        .first();

      if (!workspace) return res.status(404).json({ message: "Not found" });

      const models = await db("models").where({ workspaceId });

      return res.json({ workspace, models });
    } catch (err) {
      console.error("Error happened on server:", err);

      return res.status(500).json({ message: err.message });
    }
  };

  getUserWorkspace = async (req, res) => {
    const user = req.user;
    try {
      const workspaces = await db("workspaces").where({ ownerId: user.id });

      return res.status(200).json({
        workspaces: workspaces,
      });
    } catch (err) {
      console.error("Error happened on server:", err);

      return res.status(500).json({ message: err.message });
    }
  };

  getAllUserWorkspaces = async (req, res) => {
    const user = req.user;
    try {
      const workspaces = await db("user_workspaces")
        .join(
          "workspaces",
          "user_workspaces.workspace_id",
          "=",
          "workspaces.id"
        )
        .where("user_workspaces.user_id", user.id);
      console.log(workspaces);

      return res.status(200).json({
        workspaces: workspaces,
      });
    } catch (err) {
      console.error("Error happened on server:", err);

      return res.status(500).json({ message: err.message });
    }
  };

  createWorkspace = async (req, res) => {
    const user = req.user;
    const { name } = req.body;

    try {
      const schemaName = `p_${user.id}_${Date.now()}_dev`;

      await db.schema.createSchemaIfNotExists(schemaName);

      const [workspace] = await db("workspaces")
        .insert({
          name: name,
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
      });
    } catch (err) {
      console.error("Error happened on server:", err);

      return res.status(500).json({ message: err.message });
    }
  };

  deployWorkspace = async (req, res) => {
    const { workspaceId } = req.params;
    
    try {
      const workspace = await db('workspaces')
        .where({ id: workspaceId })
        .first();
      
      if (!workspace) {
        return res.status(404).json({ message: 'Workspace not found' });
      }
      
      const models = await db('models').where({ workspaceId });
      
      if (models.length === 0) {
        return res.status(400).json({ message: 'No models to deploy' });
      }
      
      const results = [];
      
      for (const model of models) {
        try {
          const fields = await db('fields').where({ modelId: model.id });
          await buildCreateTableSQL(model, fields, workspace.schemaName, models);
          
          results.push({ 
            model: model.name, 
            status: 'success' 
          });
        } catch (err) {
          results.push({ 
            model: model.name, 
            status: 'error', 
            error: err.message 
          });
        }
      }
      
      return res.status(200).json({
        message: 'Deployment completed',
        schemaName: workspace.schemaName,
        results
      });
      
    } catch (err) {
      console.error('Deploy error:', err);
      return res.status(500).json({ message: err.message });
    }
  };

}

module.exports = new WorkspaceController();
