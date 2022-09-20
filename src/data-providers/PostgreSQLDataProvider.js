// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

// This data provider ('postgresql') connects to a PostgreSQL database.
// Connection options are:
// * 'host': database server host
// * 'port': database server port
// * 'user': database server username
// * 'password': database server password
// * 'database': database name

const pgp  = require('pg-promise')();

const { v4: uuidv4 } = require('uuid');
const { Pool } = require("pg");

var Parent = require('./AbstractDataProvider')
var config = require('../config')

class PostgreSQLDataProvider extends Parent.AbstractDataProvider
{
    constructor()
    {
        super("PostegreSQL database data provider.");

        // Store tables names.
        const cfg = new config.Config();

        this.tableName_foods        = cfg.provider.options.prefix + "_foods";
        this.tableName_recipegroups = cfg.provider.options.prefix + "_recipegroups";
        this.tableName_recipes      = cfg.provider.options.prefix + "_recipes";
    }

    connect(options)
    {
        this.pool = new Pool(options)
        return true
    }

    disconnect(options)
    {
        this.pool.end()
    }

    getFoods()
    {
        var promise = new Promise((resolve, reject) =>
        {
            var data = {foods: []}

            this.pool.query("SELECT id, title, details FROM " + this.tableName_foods).then(function(res)
            {
                for (let i = 0 ; i < res.rowCount ; i++)
                {
                    var item = res.rows[i]
                    data.foods.push(item)
                }

                resolve({code: 200, data: data})
            }).catch(e =>
            {
                resolve({code: 500, data: null})
            })
        })

        return promise
    }

    getRecipeGroups()
    {
        var promise = new Promise((resolve, reject) =>
        {
            var data = {recipeGroups: []}

            this.pool.query("SELECT id, title FROM " + this.tableName_recipegroups).then(function(res)
            {
                for (let i = 0 ; i < res.rowCount ; i++)
                {
                    var item = res.rows[i]
                    data.recipeGroups.push(item)
                }

                resolve({code: 200, data: data})
            }).catch(e =>
            {
                resolve({code: 500, data: null})
            })
        })

        return promise
    }

    getFoodData(id)
    {
        var promise = new Promise((resolve, reject) =>
        {
            this.pool.query("SELECT * FROM " + this.tableName_foods + " WHERE id = $1", [id]).then(function(res)
            {
                if (res.rowCount == 0)
                {
                    resolve({code: 404, data: null})
                }

                else if (res.rowCount == 1)
                {
                    resolve({code: 200, data: res.rows[0]})
                }

                else
                {
                    resolve({code: 500, data: null})
                }
            }).catch(e =>
            {
                resolve({code: 500, data: null})
            })
        })

        return promise
    }

    getRecipeGroupData(id)
    {
        var promise = new Promise((resolve, reject) =>
        {
            this.pool.query("SELECT * FROM " + this.tableName_recipegroups + " WHERE id = $1", [id]).then(function(res)
            {
                if (res.rowCount == 0)
                {
                    resolve({code: 404, data: null})
                }

                else if (res.rowCount == 1)
                {
                    resolve({code: 200, data: res.rows[0]})
                }

                else
                {
                    resolve({code: 500, data: null})
                }
            }).catch(e =>
            {
                resolve({code: 500, data: null})
            })
        })

        return promise
    }

    createFood()
    {
        var promise = new Promise((resolve, reject) =>
        {
            this.pool.query("INSERT INTO " + this.tableName_foods + " (id, title, details, months, \"supplyArea\", cost, \"environmentalImpact\", nutrition) VALUES ('" + uuidv4() + "', '', '', ARRAY[]::integer[], 0, 0.0, '{ \"co2eq\": { \"kgco2e_kg\": 0.0, \"source\": \"\" } }', '{ \"energy\": { \"value\": 0.0, \"source\": \"\" }, \"proteins\": { \"value\": 0.0, \"source\": \"\" }, \"carbohydrates\": { \"value\": 0.0, \"source\": \"\" }, \"lipids\": { \"value\": 0.0, \"source\": \"\" }, \"sugars\": { \"value\": 0.0, \"source\": \"\" }, \"fibers\": { \"value\": 0.0, \"source\": \"\" }, \"omega3_ala\": { \"value\": 0.0, \"source\": \"\" }, \"omega3_epa\": { \"value\": 0.0, \"source\": \"\" }, \"omega3_dha\": { \"value\": 0.0, \"source\": \"\" }, \"omega6_la\": { \"value\": 0.0, \"source\": \"\" }, \"omega6_ara\": { \"value\": 0.0, \"source\": \"\" }, \"omega9\": { \"value\": 0.0, \"source\": \"\" }, \"salt\": { \"value\": 0.0, \"source\": \"\" }, \"calcium\": { \"value\": 0.0, \"source\": \"\" }, \"copper\": { \"value\": 0.0, \"source\": \"\" }, \"iron\": { \"value\": 0.0, \"source\": \"\" }, \"iodine\": { \"value\": 0.0, \"source\": \"\" }, \"magnesium\": { \"value\": 0.0, \"source\": \"\" }, \"sodium\": { \"value\": 0.0, \"source\": \"\" }, \"zinc\": { \"value\": 0.0, \"source\": \"\" }, \"vitamin_c\": { \"value\": 0.0, \"source\": \"\" }, \"vitamin_d\": { \"value\": 0.0, \"source\": \"\" } }') RETURNING id").then(function(res)
            {
                if (res.rowCount == 1)
                {
                    resolve({code: 200, data: JSON.parse('{"id": ' + res.rows[0].id + '}')})
                }

                else
                {
                    resolve({code: 500, data: null})
                }
            }).catch(e =>
            {
                resolve({code: 500, data: null})
            })
        })

        return promise
    }

    createRecipeGroup()
    {
        var promise = new Promise((resolve, reject) =>
        {
            this.pool.query("INSERT INTO " + this.tableName_recipegroups + " (id, title) VALUES ('" + uuidv4() + "', '') RETURNING id").then(function(res)
            {
                if (res.rowCount == 1)
                {
                    resolve({code: 200, data: JSON.parse('{"id": "' + res.rows[0].id + '"}')})
                }

                else
                {
                    resolve({code: 500, data: null})
                }
            }).catch(e =>
            {
                resolve({code: 500, data: null})
            })
        })

        return promise
    }

    deleteFood(id)
    {
        var promise = new Promise((resolve, reject) =>
        {
            this.pool.query("DELETE FROM " + this.tableName_foods + " WHERE id = $1 RETURNING id", [id]).then(function(res)
            {
                if (res.rowCount == 1)
                {
                    resolve({code: 200, data: null})
                }

                else
                {
                    resolve({code: 404, data: null})
                }
            }).catch(e =>
            {
                resolve({code: 500, data: null})
            })
        })

        return promise
    }

    deleteRecipeGroup(id)
    {
        var promise = new Promise((resolve, reject) =>
        {
            this.pool.query("DELETE FROM " + this.tableName_recipegroups + " WHERE id = $1 RETURNING id", [id]).then(function(res)
            {
                if (res.rowCount == 1)
                {
                    resolve({code: 200, data: null})
                }

                else
                {
                    resolve({code: 404, data: null})
                }
            }).catch(e =>
            {
                resolve({code: 500, data: null})
            })
        })

        return promise
    }

    updateFood(object)
    {
        var promise = new Promise((resolve, reject) =>
        {
            this.pool.query("UPDATE " + this.tableName_foods + " SET title = $1, \
                                              details = $2, \
                                              months = $3, \
                                              \"supplyArea\" = $4, \
                                              cost = $5, \
                                              \"environmentalImpact\" = $6, \
                                              nutrition = $7, \
                                              units = $8 \
                                              WHERE id = $9 RETURNING *", [object.title,
                                                               object.details,
                                                               object.months,
                                                               object.supplyArea,
                                                               object.cost,
                                                               object.environmentalImpact,
                                                               object.nutrition,
                                                               object.units,
                                                               object.id]).then(function(res)
            {
                if (res.rowCount == 1)
                {
                    resolve({code: 200, data: res.rows[0]})
                }

                else
                {
                    resolve({code: 404, data: null})
                }
            }).catch(e =>
            {
                resolve({code: 500, data: null})
            })
        })

        return promise
    }

    updateRecipeGroup(object)
    {
        console.log(object)
        
        var promise = new Promise((resolve, reject) =>
        {
            this.pool.query("UPDATE " + this.tableName_recipegroups + " SET title = $1 \
                                                 WHERE id = $2 RETURNING *", [object.title,
                                                                              object.id]).then(function(res)
            {
                if (res.rowCount == 1)
                {
                    resolve({code: 200, data: res.rows[0]})
                }

                else
                {
                    resolve({code: 404, data: null})
                }
            }).catch(e =>
            {
                console.log(e)
                resolve({code: 500, data: null})
            })
        })

        return promise
    }

    dump()
    {
        var promise = new Promise((resolve, reject) =>
        {
            var lthis = this

            var data  = 
            {
                foods:          [],
                recipeGroups:   [],
                recipes:        []
            }

            this.pool.query("SELECT * FROM " + this.tableName_foods).then(function(res)
            {
                for (let i = 0 ; i < res.rowCount ; i++)
                {
                    let item = res.rows[i]
                    data.foods.push(item)
                }

                lthis.pool.query("SELECT * FROM " + this.tableName_recipegroups).then(function(res)
                {
                    for (let i = 0 ; i < res.rowCount ; i++)
                    {
                        let item = res.rows[i]
                        data.recipeGroups.push(item)
                    }

                    lthis.pool.query("SELECT * FROM " + this.tableName_recipes).then(function(res)
                    {
                        for (let i = 0 ; i < res.rowCount ; i++)
                        {
                            let item = res.rows[i]
                            data.recipes.push(item)
                        }

                        resolve({code: 200, data: data})
                    }).catch(e =>
                    {
                        console.error("Error while dumping database. Error : " + e.code)
                        resolve({code: 500, data: null})
                    })
                }).catch(e =>
                {
                    console.error("Error while dumping database. Error : " + e.code)
                    resolve({code: 500, data: null})
                })
            }).catch(e =>
            {
                console.error("Error while dumping database. Error : " + e.code)
                resolve({code: 500, data: null})
            })
        })

        return promise;
    }

    restore(data)
    {
        var promise = new Promise((resolve, reject) =>
        {
            // Create queries list.
            const queries = [];

            // Drop table 'foods'.
            queries.push({ query: "DROP TABLE " + this.tableName_foods })

            // Create table 'foods'.
            queries.push({ query: "CREATE TABLE IF NOT EXISTS " + this.tableName_foods + " (id text NOT NULL, title text, details text, months integer[], \"supplyArea\" integer, cost double precision, \"environmentalImpact\" json, nutrition json, units json, PRIMARY KEY(id));" })

            // Drop table 'recipegroups'.
            queries.push({ query: "DROP TABLE " + this.tableName_recipegroups })

            // Create table 'recipegroups'.
            queries.push({ query: "CREATE TABLE IF NOT EXISTS " + this.tableName_recipegroups + " (id text NOT NULL, title text, PRIMARY KEY(id));" })

            // Drop table 'recipes'.
            queries.push({ query: "DROP TABLE " + this.tableName_recipes })

            // Create table 'recipes'.
            queries.push({ query: "CREATE TABLE IF NOT EXISTS " + this.tableName_recipes + " (id text NOT NULL, \"group\" text, details text, type integer, temperature integer, exclusions json, months integer[], \"nbOfParts\" double precision, picture text, recipe text, ingredients json, times json, resources json, \"ingredientsCost\" double precision, \"environmentalImpact\" json, waste json, PRIMARY KEY(id));" })

            // Add 'foods' data.
            for (let i = 0 ; i < data.foods.length ; i++)
            {
                let entry = data.foods[i];
                let query = 
                {
                    query:  "INSERT INTO " + this.tableName_foods + " (id, title, details, months, \"supplyArea\", cost, \"environmentalImpact\", nutrition, units) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
                    values:
                    [
                        entry.id,
                        entry.title,
                        entry.details,
                        entry.months,
                        entry.supplyArea,
                        entry.cost,
                        entry.environmentalImpact,
                        entry.nutrition,
                        entry.units
                    ]
                }

                queries.push(query);
            }

            // Add 'recipeGroups' data.
            for (let i = 0 ; i < data.recipeGroups.length ; i++)
            {
                let entry = data.recipeGroups[i];
                let query = 
                {
                    query:  "INSERT INTO " + this.tableName_recipegroups + " (id, title) VALUES ($1, $2)",
                    values:
                    [
                        entry.id,
                        entry.title
                    ]
                }

                queries.push(query);
            }

            // Add 'recipes' data.
            for (let i = 0 ; i < data.recipes.length ; i++)
            {
                let entry = data.recipes[i];
                let query = 
                {
                    query:  "INSERT INTO " + this.tableName_recipes + " (id, \"group\", details, type, temperature, exclusions, months, \"nbOfParts\", weight, picture, recipe, ingredients, times, resources, \"ingredientsCost\", \"environmentalImpact\", waste) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)",
                    values:
                    [
                        entry.id,
                        entry.group,
                        entry.details,
                        entry.type,
                        entry.temperature,
                        entry.exclusions,
                        entry.months,
                        entry.nbOfParts,
                        entry.weight,
                        entry.picture,
                        entry.recipe,
                        entry.ingredients,
                        entry.times,
                        entry.resources,
                        entry.ingredientsCost,
                        entry.environmentalImpact,
                        entry.waste
                    ]
                }

                queries.push(query);
            }

            // Merge queries.
            const sql = pgp.helpers.concat(queries);

            // Execute queries.
            this.pool.query(sql).then(function(res)
            {
                resolve({code: 200, data: null})
            }).catch(e =>
            {
                console.error("Error while restoring database. Error : " + e.code)
                resolve({code: 500, data: null})
            })
        })

        return promise;
    }

    init()
    {
        var promise = new Promise((resolve, reject) =>
        {
            // Create queries list.
            const queries = [];

            // Create table 'foods'.
            queries.push({ query: "CREATE TABLE IF NOT EXISTS " + this.tableName_foods + " (id text NOT NULL, title text, details text, months integer[], \"supplyArea\" integer, cost double precision, \"environmentalImpact\" json, nutrition json, units json, PRIMARY KEY(id));" })

            // Create table 'recipegroups'.
            queries.push({ query: "CREATE TABLE IF NOT EXISTS " + this.tableName_recipegroups + " (id text NOT NULL, title text, PRIMARY KEY(id));" })

            // Create table 'recipes'.
            queries.push({ query: "CREATE TABLE IF NOT EXISTS " + this.tableName_recipes + " (id text NOT NULL, \"group\" text, details text, type integer, temperature integer, exclusions json, months integer[], \"nbOfParts\" double precision, picture text, recipe text, ingredients json, times json, resources json, \"ingredientsCost\" double precision, \"environmentalImpact\" json, waste json, PRIMARY KEY(id));" })

            // Merge queries.
            const sql = pgp.helpers.concat(queries);

            // Execute queries.
            this.pool.query(sql).then(function(res)
            {
                resolve({code: 200, data: null})
            }).catch(e =>
            {
                console.error("Error while initializing database. Error : " + e.code)
                resolve({code: 500, data: null})
            })
        })

        return promise;
    }

    createRecipe()
    {
        var promise = new Promise((resolve, reject) =>
        {
            this.pool.query("INSERT INTO " + this.tableName_recipes + " (id, \"group\", details, type, temperature, exclusions, months, \"nbOfParts\", weight, picture, recipe, ingredients, times, resources, \"ingredientsCost\", \"environmentalImpact\", waste) VALUES ('" + uuidv4() + "', '', '', 0, 0, '{ \"meat\": false, \"fish\": false, \"dairy\": false, \"eggs\": false, \"oap\": false }', ARRAY[]::integer[], 0.0, 0.0, '', '', '[]', '{ \"preparation\": 0.0, \"cooking\": 0.0, \"rest\": 0.0 }', '{ \"energy\": {\"oven\": 0.0, \"hob\": 0.0}, \"water\": 0.0 }', 0.0, '{\"ingredientsCo2eq\": 0.0}', '{ \"water\": 0.0, \"recyclable\": { \"ingredients\": {}, \"biodegradable\": 0.0, \"plastics\": 0.0, \"bricks\": 0.0, \"papers\": 0.0, \"glasses\": 0.0, \"others\": 0.0 }, \"nonRecyclable\": 0.0 }') RETURNING id").then(function(res)
            {
                if (res.rowCount == 1)
                {
                    resolve({code: 200, data: JSON.parse('{"id": ' + res.rows[0].id + '}')})
                }

                else
                {
                    resolve({code: 500, data: null})
                }
            }).catch(e =>
            {
                resolve({code: 500, data: null})
            })
        })

        return promise
    }

    deleteRecipe(id)
    {
        var promise = new Promise((resolve, reject) =>
        {
            this.pool.query("DELETE FROM " + this.tableName_recipes + " WHERE id = $1 RETURNING id", [id]).then(function(res)
            {
                if (res.rowCount == 1)
                {
                    resolve({code: 200, data: null})
                }

                else
                {
                    resolve({code: 404, data: null})
                }
            }).catch(e =>
            {
                resolve({code: 500, data: null})
            })
        })

        return promise
    }

    getRecipeData(id)
    {
        var promise = new Promise((resolve, reject) =>
        {
            this.pool.query("SELECT * FROM " + this.tableName_recipes + " WHERE id = $1", [id]).then(function(res)
            {
                if (res.rowCount == 0)
                {
                    resolve({code: 404, data: null})
                }

                else if (res.rowCount == 1)
                {
                    resolve({code: 200, data: res.rows[0]})
                }

                else
                {
                    resolve({code: 500, data: null})
                }
            }).catch(e =>
            {
                resolve({code: 500, data: null})
            })
        })

        return promise
    }

    getRecipeMetadata(id)
    {
        var promise = new Promise((resolve, reject) =>
        {
            this.pool.query("SELECT id, \"group\", details, type, temperature, exclusions, months, \"nbOfParts\", weight, times, resources, \"ingredientsCost\", \"environmentalImpact\" FROM " + this.tableName_recipes + " WHERE id = $1", [id]).then(function(res)
            {
                if (res.rowCount == 0)
                {
                    resolve({code: 404, data: null})
                }

                else if (res.rowCount == 1)
                {
                    resolve({code: 200, data: res.rows[0]})
                }

                else
                {
                    resolve({code: 500, data: null})
                }
            }).catch(e =>
            {
                resolve({code: 500, data: null})
            })
        })
    }

    updateRecipe(object)
    {
        var promise = new Promise((resolve, reject) =>
        {
            this.pool.query("UPDATE " + this.tableName_foods + " SET \"group\" = $1, \
                                              details = $2, \
                                              type = $3, \
                                              temperature = $4, \
                                              exclusions = $5, \
                                              months = $6, \
                                              \"nbOfParts\" = $7, \
                                              weight = $8, \
                                              picture = $9, \
                                              recipe = $10, \
                                              ingredients = $11, \
                                              times = $12, \
                                              resources = $13, \
                                              \"ingredientsCost\" = $14, \
                                              \"environmentalImpact\" = $15, \
                                              waste = $16 \
                                              WHERE id = $17 RETURNING *", [object.group,
                                                               object.details,
                                                               object.type,
                                                               object.temperature,
                                                               object.exclusions,
                                                               object.months,
                                                               object.nbOfParts,
                                                               object.weight,
                                                               object.picture,
                                                               object.recipe,
                                                               object.ingredients,
                                                               object.times,
                                                               object.resources,
                                                               object.ingredientsCost,
                                                               object.environmentalImpact,
                                                               object.waste,
                                                               object.id]).then(function(res)
            {
                if (res.rowCount == 1)
                {
                    resolve({code: 200, data: res.rows[0]})
                }

                else
                {
                    resolve({code: 404, data: null})
                }
            }).catch(e =>
            {
                resolve({code: 500, data: null})
            })
        })

        return promise
    }
}

module.exports.PostgreSQLDataProvider = PostgreSQLDataProvider
