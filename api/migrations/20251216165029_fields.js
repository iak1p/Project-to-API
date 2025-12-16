/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("fields", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table
      .integer("modelId")
      .unsigned()
      .references("id")
      .inTable("models")
      .onDelete("CASCADE")
      .notNullable();
    table.datetime("createdAt").notNullable().defaultTo(knex.fn.now());
    table
      .enum(
        "type",
        ["string", "int", "float", "bool", "datetime", "relation"],
        {
          useNative: true,
          enumName: "field_type",
        }
      )
      .notNullable();
    table
      .integer("relationModelId")
      .unsigned()
      .references("id")
      .inTable("models")
      .onDelete("CASCADE");
    table
      .enu("relationType", ["one", "many", "m2m"], {
        useNative: true,
        enumName: "relation_type",
      })
      .nullable();
    table.boolean("isRequired").notNullable().defaultTo(false);
    table.boolean("isUnique").notNullable().defaultTo(false);
    table.jsonb("defaultValue").nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("fields");
  await knex.raw('DROP TYPE IF EXISTS "field_type"');
  await knex.raw('DROP TYPE IF EXISTS "relation_type"');
};
