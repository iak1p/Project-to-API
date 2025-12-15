/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("workspaces", (table) => {
    table.increments("id").primary();
    table.string("name").unique();
    table.string("slug").unique();
    table
      .integer("ownerId")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.datetime("createdAt").notNullable().defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
