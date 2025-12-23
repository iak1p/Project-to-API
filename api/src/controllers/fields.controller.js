const db = require("../utils/db");

class FieldsController {
  createField = async (req, res) => {
    const {
      name,
      modelId,
      type,
      relationModelId,
      relationType,
      isRequired,
      isUnique,
      defaultValue,
    } = req.body ?? {};

    if (!modelId)
      return res.status(400).json({ message: "modelId is required" });

    if (!name) return res.status(400).json({ message: "name is required" });

    if (!type) return res.status(400).json({ message: "type is required" });

    if (modelId === relationModelId)
      return res
        .status(400)
        .json({ message: "A field cannot relate to its own model" });

    try {
      const existField = await db("fields").where({ modelId, name }).first();

      if (existField) {
        return res
          .status(409)
          .json({ message: "Field with this name already exists" });
      }

      let relatedModel = null;
      if (relationModelId) {
        relatedModel = await db("models")
          .where({ id: relationModelId })
          .first();
      }

      if (relationModelId && !relatedModel)
        return res
          .status(400)
          .json({ message: "Related model does not exist" });

      const [field] = await db("fields")
        .insert({
          name: name,
          modelId: modelId,
          type,
          relationModelId: relationModelId ?? null,
          relationType: relationType ?? null,
          isRequired: isRequired ?? false,
          isUnique: isUnique ?? false,
          defaultValue: defaultValue ?? null,
        })
        .returning("*");

      return res.status(200).json({
        field: field,
      });
    } catch (err) {
      console.error("Error happened on server:", err);

      return res.status(500).json({ message: err.message });
    }
  };
}

module.exports = new FieldsController();
