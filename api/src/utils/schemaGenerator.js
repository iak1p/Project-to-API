const db = require('./db');

const FIELD_TYPES = {
    STRING: 'string',
    INT: 'int',
    FLOAT: 'float',
    BOOL: 'bool',
    DATETIME: 'datetime',
    RELATION: 'relation'
};

const FIELD_TYPE_MAPPING = {
    [FIELD_TYPES.STRING]: 'string',
    [FIELD_TYPES.INT]: 'integer',
    [FIELD_TYPES.FLOAT]: 'float',
    [FIELD_TYPES.BOOL]: 'boolean',
    [FIELD_TYPES.DATETIME]: 'datetime',
};

/**
 * Validates a field object
 * @param {Object} field 
 */
function validateField(field) {
  if (!field || typeof field !== 'object') {
    throw new Error('Field must be an object');
  }
  
  if (!field.name || typeof field.name !== 'string') {
    throw new Error('Field name is required');
  }
  
  if (!Object.values(FIELD_TYPES).includes(field.type)) {
    throw new Error(`Invalid field type: ${field.type}`);
  }
  
  if (field.type === FIELD_TYPES.RELATION) {
    if (!field.relationModelId) {
      throw new Error('relationModelId is required for relation fields');
    }
    if (!['one', 'many', 'm2m'].includes(field.relationType)) {
      throw new Error('Invalid relationType');
    }
  }
}

/**
 * Creates a table in the specified schema
 * @param {string} schemaName - PostgreSQL schema name
 * @param {Object} model - Model object with name
 * @param {Array} fields - Array of field objects
 */
async function buildCreateTableSQL(model, fields, schemaName, models){
    if (!schemaName || typeof schemaName !== 'string'){
        throw new Error('schemaName is required');
    }

    if (!model || !model.name) {
        throw new Error('model with name is required');
    }

    if (!Array.isArray(fields)) {
        throw new Error('fields must be an array');
    }

    fields.forEach(validateField);
    const tableName = model.name.toLowerCase();

    await db.schema.withSchema(schemaName).createTableIfNotExists(tableName, (table) => {
        table.increments('id').primary();

        fields.forEach(field => {
            if (field.type === FIELD_TYPES.RELATION) {
                const relatedModel = models.find(m => m.id === field.relationModelId);
                if (relatedModel) {
                    buildForeignKey(table, field, relatedModel);
                }
            } else {
                const knexType = mapFieldTypeToKnex(field.type);
                let column = table[knexType](field.name);
                column = applyConstraints(column, field);
            }
        });
        table.timestamps(true, true);
    });
    console.log(`Table ${tableName} created is schema ${schemaName}`);
}

/**
 * Maps field type to Knex column type
 * @param {string} fieldType 
 * @return {string} Knex column type 
 */
function mapFieldTypeToKnex(fieldType){
    const knexType = FIELD_TYPE_MAPPING[fieldType];
    if (!knexType) {
        throw new Error(`Unsopported field type: ${fieldType}`);
    }
    return knexType;
}

/**
 * Applies constraints to a column
 * @param {Object} column - Knex column builder
 * @param {Object} field - Field configuration
 * @returns {Object} Modified column builder
 */
function applyConstraints(column, field){
    if (field.isRequired) {
        column = column.notNullable();
    }

    if (field.isUnique) {
        column = column.unique();
    }

    if (field.defaultValue !== null && field.defaultValue !== undefined) {
        column = column.defaultTo(field.defaultValue);
    }

    return column;
}


/**
 * Builds a foreign key relationship
 * @param {Object} table - Knex table builder 
 * @param {Object} field - Field with relation
 * @param {Object} relatedModel - Related model object
 */
function buildForeignKey(table, field, relatedModel){
    if (!relatedModel) {
        throw new Error(`Related model not found for field ${field.name}`);
    }

    const relatedTableName = relatedModel.name.toLowerCase();

    let column = table.integer(field.name)
        .unsigned()
        .references('id')
        .inTable(relatedTableName)
        .onDelete('CASCADE');

    column = applyConstraints(column, field);
}

module.exports = {
    buildCreateTableSQL,
    FIELD_TYPES
};
