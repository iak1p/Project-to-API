/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("models", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table
      .integer("workspaceId")
      .unsigned()
      .references("id")
      .inTable("workspaces")
      .onDelete("CASCADE")
      .notNullable();
    table.datetime("createdAt").notNullable().defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
