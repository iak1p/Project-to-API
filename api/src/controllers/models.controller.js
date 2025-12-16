const db = require("../utils/db");

class ModelsController {
  createModel = async (req, res) => {
    const { name, workspaceId } = req.body ?? {};

    if (!workspaceId)
      return res.status(400).json({ message: "workspaceId is required" });

    if (!name) return res.status(400).json({ message: "name is required" });

    try {
      const existModel = await db("models")
        .where({ workspaceId, name })
        .first();

      if (existModel) {
        return res
          .status(409)
          .json({ message: "Model with this name already exists" });
      }

      const [model] = await db("models")
        .insert({
          name: name,
          workspaceId: workspaceId,
        })
        .returning("*");

      return res.status(200).json({
        model: model,
      });
    } catch (err) {
      console.error("Error happened on server:", err);

      return res.status(500).json({ message: err.message });
    }
  };
  deleteModelById = async (req, res) => {
    const { modelId } = req.params ?? {};

    if (!modelId)
      return res.status(400).json({ message: "modelId is required" });

    try {
      const deleted = await db("models").where({ id: modelId }).del();

      if (deleted === 0) {
        return res.status(404).json({ message: "Model not found" });
      }

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Error happened on server:", err);

      return res.status(500).json({ message: err.message });
    }
  };
  getById = async (req, res) => {
    const { modelId } = req.params ?? {};

    if (!modelId)
      return res.status(400).json({ message: "modelId is required" });

    try {
      const model = await db("models").where({ id: modelId }).first();

      if (!model) return res.status(404).json({ message: "Not found" });

      const fields = await db("fields").where({ modelId });

      return res.json({ model, fields });
    } catch (err) {
      console.error("Error happened on server:", err);

      return res.status(500).json({ message: err.message });
    }
  };
}

module.exports = new ModelsController();
