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

        this.tableName_foods            = cfg.provider.options.prefix + "_foods";
        this.tableName_recipegroups     = cfg.provider.options.prefix + "_recipegroups";
        this.tableName_recipes          = cfg.provider.options.prefix + "_recipes";
        this.tableName_configuration    = cfg.provider.options.prefix + "_configuration";

        // PostgreSQL database version.
        this.db_version = "1"

        // Physical data.
        this.co2_electricity    = 0.074
        this.co2_gas            = 0.443
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
            this.pool.query("INSERT INTO " + this.tableName_foods + " (id, title, details, picture, months, \"supplyArea\", cost, \"environmentalImpact\", nutrition) VALUES ('" + uuidv4() + "', '', '', '', ARRAY[]::integer[], 0, 0.0, '{ \"co2eq\": { \"kgco2e_kg\": 0.0, \"source\": \"\" } }', '{ \"energy\": { \"value\": 0.0, \"source\": \"\" }, \"proteins\": { \"value\": 0.0, \"source\": \"\" }, \"carbohydrates\": { \"value\": 0.0, \"source\": \"\" }, \"lipids\": { \"value\": 0.0, \"source\": \"\" }, \"sugars\": { \"value\": 0.0, \"source\": \"\" }, \"fibers\": { \"value\": 0.0, \"source\": \"\" }, \"omega3_ala\": { \"value\": 0.0, \"source\": \"\" }, \"omega3_epa\": { \"value\": 0.0, \"source\": \"\" }, \"omega3_dha\": { \"value\": 0.0, \"source\": \"\" }, \"omega6_la\": { \"value\": 0.0, \"source\": \"\" }, \"omega6_ara\": { \"value\": 0.0, \"source\": \"\" }, \"omega9\": { \"value\": 0.0, \"source\": \"\" }, \"salt\": { \"value\": 0.0, \"source\": \"\" }, \"calcium\": { \"value\": 0.0, \"source\": \"\" }, \"copper\": { \"value\": 0.0, \"source\": \"\" }, \"iron\": { \"value\": 0.0, \"source\": \"\" }, \"iodine\": { \"value\": 0.0, \"source\": \"\" }, \"magnesium\": { \"value\": 0.0, \"source\": \"\" }, \"sodium\": { \"value\": 0.0, \"source\": \"\" }, \"zinc\": { \"value\": 0.0, \"source\": \"\" }, \"vitamin_c\": { \"value\": 0.0, \"source\": \"\" }, \"vitamin_d\": { \"value\": 0.0, \"source\": \"\" } }') RETURNING id").then(function(res)
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
                                              picture = $3, \
                                              months = $4, \
                                              \"supplyArea\" = $5, \
                                              cost = $6, \
                                              \"environmentalImpact\" = $7, \
                                              nutrition = $8, \
                                              units = $9 \
                                              WHERE id = $10 RETURNING *", [object.title,
                                                               object.details,
                                                               object.picture,
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
            queries.push({ query: "CREATE TABLE IF NOT EXISTS " + this.tableName_foods + " (id text NOT NULL, title text, details text, picture text, months integer[], \"supplyArea\" integer, cost double precision, \"environmentalImpact\" json, nutrition json, units json, PRIMARY KEY(id));" })

            // Drop table 'recipegroups'.
            queries.push({ query: "DROP TABLE " + this.tableName_recipegroups })

            // Create table 'recipegroups'.
            queries.push({ query: "CREATE TABLE IF NOT EXISTS " + this.tableName_recipegroups + " (id text NOT NULL, title text, PRIMARY KEY(id));" })

            // Drop table 'recipes'.
            queries.push({ query: "DROP TABLE " + this.tableName_recipes })

            // Create table 'recipes'.
            queries.push({ query: "CREATE TABLE IF NOT EXISTS " + this.tableName_recipes + " (id text NOT NULL, \"group\" text, details text, type integer, temperature integer, exclusions json, months integer[], tags text[], \"nbOfParts\" double precision, weight double precision, picture text, recipe text, ingredients json[], times json, resources json, \"ingredientsCost\" double precision, \"environmentalImpact\" json, waste json, PRIMARY KEY(id));" })

            // Add 'foods' data.
            for (let i = 0 ; i < data.foods.length ; i++)
            {
                let entry = data.foods[i];
                let query = 
                {
                    query:  "INSERT INTO " + this.tableName_foods + " (id, title, details, picture, months, \"supplyArea\", cost, \"environmentalImpact\", nutrition, units) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
                    values:
                    [
                        entry.id,
                        entry.title,
                        entry.details,
                        entry.picture,
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
                    query:  "INSERT INTO " + this.tableName_recipes + " (id, \"group\", details, type, temperature, exclusions, months, tags, \"nbOfParts\", weight, picture, recipe, ingredients, times, resources, \"ingredientsCost\", \"environmentalImpact\", waste) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)",
                    values:
                    [
                        entry.id,
                        entry.group,
                        entry.details,
                        entry.type,
                        entry.temperature,
                        entry.exclusions,
                        entry.months,
                        entry.tags,
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
            queries.push({ query: "CREATE TABLE IF NOT EXISTS " + this.tableName_foods + " (id text NOT NULL, title text, details text, picture text, months integer[], \"supplyArea\" integer, cost double precision, \"environmentalImpact\" json, nutrition json, units json, PRIMARY KEY(id));" })

            // Create table 'recipegroups'.
            queries.push({ query: "CREATE TABLE IF NOT EXISTS " + this.tableName_recipegroups + " (id text NOT NULL, title text, PRIMARY KEY(id));" })

            // Create table 'recipes'.
            queries.push({ query: "CREATE TABLE IF NOT EXISTS " + this.tableName_recipes + " (id text NOT NULL, \"group\" text, details text, type integer, temperature integer, exclusions json, months integer[], tags text[], \"nbOfParts\" double precision, weight double precision, picture text, recipe text, ingredients json[], times json, resources json, \"ingredientsCost\" double precision, \"environmentalImpact\" json, waste json, PRIMARY KEY(id));" })

            // Create table 'configuration'.
            var dataco2 =
            {
                co2eq_kwh_electricity:  this.co2_electricity,
                co2eq_kwh_gas:          this.co2_gas
            }

            queries.push({ query: "CREATE TABLE IF NOT EXISTS " + this.tableName_configuration + " (version text NOT NULL, data_co2 json, PRIMARY KEY(version));" })
            queries.push({ query: "INSERT INTO " + this.tableName_configuration + " (version, data_co2) VALUES ('" + this.db_version + "', '" + JSON.stringify(dataco2) + "');"})

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
            this.pool.query("INSERT INTO " + this.tableName_recipes + " (id, \"group\", details, type, temperature, exclusions, months, tags, \"nbOfParts\", weight, picture, recipe, ingredients, times, resources, \"ingredientsCost\", \"environmentalImpact\", waste) VALUES ('" + uuidv4() + "', '', '', 0, 0, '{ \"meat\": false, \"fish\": false, \"dairy\": false, \"eggs\": false, \"oap\": false }', ARRAY[]::integer[], ARRAY[]::text[], 0.0, 0.0, '', '', ARRAY[]::json[], '{ \"preparation\": 0.0, \"cooking\": 0.0, \"rest\": 0.0 }', '{ \"energy\": {\"oven\": 0.0, \"hob\": 0.0, \"kettle\": 0.0}, \"water\": 0.0 }', 0.0, '{\"ingredientsCo2eq\": 0.0}', '{ \"water\": 0.0, \"recyclable\": { \"ingredients\": {}, \"biodegradable\": 0.0, \"plastics\": 0.0, \"bricks\": 0.0, \"papers\": 0.0, \"glasses\": 0.0, \"others\": 0.0 }, \"nonRecyclable\": 0.0 }') RETURNING id").then(function(res)
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
            this.pool.query("SELECT id, \"group\", details, type, temperature, exclusions, months, tags, \"nbOfParts\", weight, times, resources, \"ingredientsCost\", \"environmentalImpact\" FROM " + this.tableName_recipes + " WHERE id = $1", [id]).then(function(res)
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

    updateRecipe(object)
    {
        var promise = new Promise((resolve, reject) =>
        {
            this.pool.query("UPDATE " + this.tableName_recipes + " SET \"group\" = $1, \
                                              details = $2, \
                                              type = $3, \
                                              temperature = $4, \
                                              exclusions = $5, \
                                              months = $6, \
                                              tags = $7, \
                                              \"nbOfParts\" = $8, \
                                              weight = $9, \
                                              picture = $10, \
                                              recipe = $11, \
                                              ingredients = $12, \
                                              times = $13, \
                                              resources = $14, \
                                              \"ingredientsCost\" = $15, \
                                              \"environmentalImpact\" = $16, \
                                              waste = $17 \
                                              WHERE id = $18 RETURNING *", [object.group,
                                                               object.details,
                                                               object.type,
                                                               object.temperature,
                                                               object.exclusions,
                                                               object.months,
                                                               object.tags,
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

    getVersion()
    {
        var promise = new Promise((resolve, reject) =>
        {
            this.pool.query("SELECT version FROM " + this.tableName_configuration).then(function(res)
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

    getConfiguration()
    {
        var promise = new Promise((resolve, reject) =>
        {
            this.pool.query("SELECT * FROM " + this.tableName_configuration).then(function(res)
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

    // Determine the type of ingredients list. Returns:
    // 0 - on error (bad format, or at least one ingredient has bad format)
    // 1 - if ingredients are only foods
    // 2 - if ingredients are both foods and recipes
    ingredientListType(id, ingredients)
    {
        if (!Array.isArray(ingredients))
            return 0

        let type = 1

        for(let i = 0 ; i < ingredients.length ; i++)
        {
            let ingredient = ingredients[i]
            
            // Ingredient list includes one recipe.
            if (!ingredient.hasOwnProperty('food') && ingredient.hasOwnProperty('recipe'))
            {
                // Check for recipe id doesn't refer to current recipe (autoreference).
                if (ingredient.recipe == id)
                    return 0

                type = 2
            }

            // Ingredient bad format: 'food' nor 'recipe' is defined.
            if (!ingredient.hasOwnProperty('food') && !ingredient.hasOwnProperty('recipe'))
                return 0
        }

        return type
    }

    // Compute recipe fields and return updated recipe.
    // Use only foods for computation.
    computeRecipeFieldsWithFoods(recipe, foods)
    {
        let out = recipe

        // Reset fields.
        out.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        out.ingredientsCost = 0.0
        out.environmentalImpact.ingredientsCo2eq = 0.0

        // Add ingredients values.
        for(let i = 0 ; i < recipe.ingredients.length ; i++)
        {
            let ingredient = recipe.ingredients[i]

            if (ingredient.hasOwnProperty('food'))
            {
                let id = ingredient.food

                // Get food.
                let food = foods[id]
                
                if (food)
                {
                    out.months = out.months.filter(value => food.months.includes(value))
                    out.ingredientsCost += food.cost * ingredient.quantity
                    out.environmentalImpact.ingredientsCo2eq += food.environmentalImpact.co2eq.kgco2e_kg * ingredient.quantity
                }
            }
        }

        return out
    }

    // Compute recipe fields and return updated recipe.
    computeRecipeWithFoodsAndRecipes(recipe, foods, computedRecipesWithFoods, recipesWithFoodsAndRecipes)
    {
        let out = this.computeRecipeFieldsWithFoods(recipe, foods)

        // Add ingredients values.
        for(let i = 0 ; i < recipe.ingredients.length ; i++)
        {
            let ingredient = recipe.ingredients[i]

            if (ingredient.hasOwnProperty('recipe'))
            {
                let id = ingredient.recipe

                // Get recipe.
                let lrecipe = computedRecipesWithFoods[id]
                if (!lrecipe)
                    lrecipe = recipesWithFoodsAndRecipes[id]

                if (lrecipe)
                {
                    out.months = out.months.filter(value => lrecipe.months.includes(value))
                    out.ingredientsCost += lrecipe.ingredientsCost * ingredient.quantity
                    out.environmentalImpact.ingredientsCo2eq += lrecipe.environmentalImpact.ingredientsCo2eq * ingredient.quantity
                }
            }
        }

        return out
    }

    // Save computed fields value to check for convergence.
    saveCurrentFieldsValue(recipesWithFoodsAndRecipes)
    {
        let out = {}

        for (let id in recipesWithFoodsAndRecipes)
        {
            let recipe = recipesWithFoodsAndRecipes[id]
            
            let values =
            {
                months: recipe.months,
                ingredientsCost: recipe.ingredientsCost,
                ingredientsCo2eq : recipe.environmentalImpact.ingredientsCo2eq
            }

            out[id] = values
        }

        return out
    }

    // Convert months array to number using bitwise masks.
    monthsArrayToNumber(months)
    {
        let out = 0
        let add = 1

        for (let i = 1 ; i <= 12 ; i++)
        {
            if (months.includes(i))
                out += add

            add *= 2
        }

        return out
    }

    computeRecipeLinkedFields()
    {
        var promise = new Promise((resolve, reject) =>
        {
            let lthis = this

            // Get foods.
            this.pool.query("SELECT id, months, cost, \"environmentalImpact\" FROM " + this.tableName_foods).then(function(res)
            {
                let foods = {}
                let beginDateTimeMs = Date.now()

                for (let i = 0 ; i < res.rowCount ; i++)
                {
                    var item = res.rows[i]
                    foods[item.id] = item
                }

                // Get recipes.
                lthis.pool.query("SELECT id, months, ingredients, \"ingredientsCost\", \"environmentalImpact\" FROM " + lthis.tableName_recipes).then(function(res)
                {
                    let recipes = {}

                    for (let i = 0 ; i < res.rowCount ; i++)
                    {
                        var item = res.rows[i]
                        recipes[item.id] = item
                    }

                    // Copy recipes for updated recipes count.
                    let initialRecipes = JSON.parse(JSON.stringify(recipes));

                    // Split recipes: recipes with foods only and recipes with foods/recipes.
                    let recipesWithFoods           = {}
                    let recipesWithFoodsAndRecipes = {}

                    for (let id in recipes)
                    {
                        let ingredients = recipes[id].ingredients
                        let type        = lthis.ingredientListType(id, ingredients)

                        // Ignore bad recipes (these recipes are not computed).
                        if (type == 1)
                            recipesWithFoods[id] = recipes[id]

                        else if (type == 2)
                            recipesWithFoodsAndRecipes[id] = recipes[id]
                    }

                    // Compute fields for recipes with only foods.
                    let computedRecipesWithFoods = {}

                    for (let id in recipesWithFoods)
                    {
                        let recipe = recipesWithFoods[id]
                        let computedRecipe = lthis.computeRecipeFieldsWithFoods(recipe, foods)

                        computedRecipesWithFoods[recipe.id] = computedRecipe
                    }

                    // Save current fields values.
                    let currentFieldsValue = lthis.saveCurrentFieldsValue(recipesWithFoodsAndRecipes)

                    // Compute new values until convergence.
                    for(;;)
                    {
                        let converged = true

                        for (let id in recipesWithFoodsAndRecipes)
                        {
                            // Compute new values for all recipes.
                            let recipe = recipesWithFoodsAndRecipes[id]
                            let computedRecipe = lthis.computeRecipeWithFoodsAndRecipes(recipe, foods, computedRecipesWithFoods, recipesWithFoodsAndRecipes)

                            recipesWithFoodsAndRecipes[id] = computedRecipe

                            // Compare values with stored data.
                            let storedData = currentFieldsValue[id]

                            if (Math.abs(storedData.ingredientsCost - computedRecipe.ingredientsCost) > 0.001)
                                converged = false

                            if (Math.abs(storedData.ingredientsCo2eq - computedRecipe.environmentalImpact.ingredientsCo2eq) > 0.001)
                                converged = false

                            let initialMonthsNumber  = lthis.monthsArrayToNumber(storedData.months)
                            let computedMonthsNumber = lthis.monthsArrayToNumber(computedRecipe.months)

                            if (initialMonthsNumber != computedMonthsNumber)
                                converged = false

                            // Update stored data.
                            storedData.ingredientsCost = computedRecipe.ingredientsCost
                            storedData.ingredientsCo2eq = computedRecipe.environmentalImpact.ingredientsCo2eq
                            storedData.months = computedRecipe.months

                            currentFieldsValue[id] = storedData
                        }

                        if (converged)
                            break
                    }

                    // Count updated recipes and prepare queries.
                    let updatedRecipes = []
                    const queries = [];

                    for (let id in initialRecipes)
                    {
                        // Get initial values.
                        let i_ingredientsCost  = initialRecipes[id].ingredientsCost
                        let i_ingredientsCo2eq = initialRecipes[id].environmentalImpact.ingredientsCo2eq
                        let i_monthsNumber     = lthis.monthsArrayToNumber(initialRecipes[id].months)

                        // Get final values.
                        let recipe = computedRecipesWithFoods[id]
                        if (!recipe)
                            recipe = recipesWithFoodsAndRecipes[id]

                        if (!recipe)
                            continue

                        let f_ingredientsCost  = recipe.ingredientsCost
                        let f_ingredientsCo2eq = recipe.environmentalImpact.ingredientsCo2eq
                        let f_monthsNumber     = lthis.monthsArrayToNumber(recipe.months)

                        let updated = false

                        if (Math.abs(i_ingredientsCost - f_ingredientsCost) > 0.001)
                            updated = true

                        if (Math.abs(i_ingredientsCo2eq - f_ingredientsCo2eq) > 0.001)
                            updated = true

                        if (i_monthsNumber != f_monthsNumber)
                            updated = true

                        if (updated)
                        {
                            updatedRecipes.push(id)

                            queries.push(
                            {
                                query: "UPDATE " + lthis.tableName_recipes + " SET months = $1, \"ingredientsCost\" = $2, \"environmentalImpact\" = $3 WHERE id = $4;",
                                values:
                                [
                                    recipe.months,
                                    recipe.ingredientsCost,
                                    recipe.environmentalImpact,
                                    recipe.id
                                ]
                            })
                        }
                    }

                    // Define output data.
                    let executionTimeMs = Date.now() - beginDateTimeMs

                    // Save recipes.
                    const sql = pgp.helpers.concat(queries);

                    lthis.pool.query(sql).then(function(res)
                    {
                        resolve({code: 200, data:
                        {
                            foodNumber:         Object.keys(foods).length,
                            recipeNumber:       Object.keys(recipes).length,
                            timeOfProcessing:   executionTimeMs,
                            updatedRecipes:     updatedRecipes
                        }})
                    }).catch(e =>
                    {
                        resolve({code: 500, data: null})
                    })
                }).catch(e =>
                {
                    resolve({code: 500, data: null})
                })
            }).catch(e =>
            {
                resolve({code: 500, data: null})
            })
        })

        return promise
    }

    getRecipes(group)
    {
        var promise = new Promise((resolve, reject) =>
        {
            this.pool.query("SELECT id FROM " + this.tableName_recipes + " WHERE \"group\" = $1", [group]).then(function(res)
            {
                if (res.rowCount == 0)
                {
                    resolve({code: 404, data: null})
                }

                else
                {
                    var data = {recipes: []}

                    for (let i = 0 ; i < res.rowCount ; i++)
                    {
                        var item = res.rows[i]
                        data.recipes.push(item.id)
                    }

                    resolve({code: 200, data: data})
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
