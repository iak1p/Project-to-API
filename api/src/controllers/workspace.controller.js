const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../utils/db");

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
    const { name, slug } = req.body;

    try {
      const [workspace] = await db("workspaces")
        .insert({
          name: name,
          slug: slug,
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
}

module.exports = new WorkspaceController();
