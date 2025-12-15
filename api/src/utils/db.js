const knex = require("knex");
const config = require("../../knexfile.js");
module.exports = db = knex(config.development);
