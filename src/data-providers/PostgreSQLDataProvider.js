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

class PostgreSQLDataProvider extends Parent.AbstractDataProvider
{
    constructor()
    {
        super("PostegreSQL database data provider.");
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

            this.pool.query("SELECT id, title, details FROM foods").then(function(res)
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

            this.pool.query("SELECT id, title FROM recipegroups").then(function(res)
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
            this.pool.query("SELECT * FROM foods WHERE id = $1", [id]).then(function(res)
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
            this.pool.query("SELECT * FROM recipegroups WHERE id = $1", [id]).then(function(res)
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
            this.pool.query("INSERT INTO foods (id, title, details, months, \"supplyArea\", cost, \"environmentalImpact\", nutrition) VALUES ('" + uuidv4() + "', '', '', ARRAY[]::integer[], 0, 0.0, '{ \"co2eq\": { \"kgco2e_kg\": 0.0, \"source\": \"\" } }', '{ \"energy\": { \"value\": 0.0, \"source\": \"\" }, \"proteins\": { \"value\": 0.0, \"source\": \"\" }, \"carbohydrates\": { \"value\": 0.0, \"source\": \"\" }, \"lipids\": { \"value\": 0.0, \"source\": \"\" }, \"sugars\": { \"value\": 0.0, \"source\": \"\" }, \"fibers\": { \"value\": 0.0, \"source\": \"\" }, \"omega3_ala\": { \"value\": 0.0, \"source\": \"\" }, \"omega3_epa\": { \"value\": 0.0, \"source\": \"\" }, \"omega3_dha\": { \"value\": 0.0, \"source\": \"\" }, \"omega6_la\": { \"value\": 0.0, \"source\": \"\" }, \"omega6_ara\": { \"value\": 0.0, \"source\": \"\" }, \"omega9\": { \"value\": 0.0, \"source\": \"\" }, \"salt\": { \"value\": 0.0, \"source\": \"\" }, \"calcium\": { \"value\": 0.0, \"source\": \"\" }, \"copper\": { \"value\": 0.0, \"source\": \"\" }, \"iron\": { \"value\": 0.0, \"source\": \"\" }, \"iodine\": { \"value\": 0.0, \"source\": \"\" }, \"magnesium\": { \"value\": 0.0, \"source\": \"\" }, \"sodium\": { \"value\": 0.0, \"source\": \"\" }, \"zinc\": { \"value\": 0.0, \"source\": \"\" }, \"vitamin_c\": { \"value\": 0.0, \"source\": \"\" }, \"vitamin_d\": { \"value\": 0.0, \"source\": \"\" } }') RETURNING id").then(function(res)
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
            this.pool.query("INSERT INTO recipegroups (id, title) VALUES ('" + uuidv4() + "', '') RETURNING id").then(function(res)
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
            this.pool.query("DELETE FROM foods WHERE id = $1 RETURNING id", [id]).then(function(res)
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
            this.pool.query("DELETE FROM recipegroups WHERE id = $1 RETURNING id", [id]).then(function(res)
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
            this.pool.query("UPDATE foods SET title = $1, \
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
            this.pool.query("UPDATE recipegroups SET title = $1 \
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
                recipeGroups:   []
            }

            this.pool.query("SELECT * FROM foods").then(function(res)
            {
                for (let i = 0 ; i < res.rowCount ; i++)
                {
                    let item = res.rows[i]
                    data.foods.push(item)
                }

                lthis.pool.query("SELECT * FROM recipegroups").then(function(res)
                {
                    for (let i = 0 ; i < res.rowCount ; i++)
                    {
                        let item = res.rows[i]
                        data.recipeGroups.push(item)
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
            queries.push({ query: "DROP TABLE foods" })

            // Create table 'foods'.
            queries.push({ query: "CREATE TABLE IF NOT EXISTS foods (id text NOT NULL, title text, details text, months integer[], \"supplyArea\" integer, cost double precision, \"environmentalImpact\" json, nutrition json, units json, PRIMARY KEY(id));" })

            // Drop table 'recipegroups'.
            queries.push({ query: "DROP TABLE recipegroups" })

            // Create table 'recipegroups'.
            queries.push({ query: "CREATE TABLE IF NOT EXISTS recipegroups (id text NOT NULL, title text, PRIMARY KEY(id));" })

            // Add 'foods' data.
            for (let i = 0 ; i < data.foods.length ; i++)
            {
                let entry = data.foods[i];
                let query = 
                {
                    query:  "INSERT INTO foods (id, title, details, months, \"supplyArea\", cost, \"environmentalImpact\", nutrition, units) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
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
                    query:  "INSERT INTO recipegroups (id, title) VALUES ($1, $2)",
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
            queries.push({ query: "CREATE TABLE IF NOT EXISTS foods (id text NOT NULL, title text, details text, months integer[], \"supplyArea\" integer, cost double precision, \"environmentalImpact\" json, nutrition json, units json, PRIMARY KEY(id));" })

            // Create table 'recipegroups'.
            queries.push({ query: "CREATE TABLE IF NOT EXISTS recipegroups (id text NOT NULL, title text, PRIMARY KEY(id));" })

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
}

module.exports.PostgreSQLDataProvider = PostgreSQLDataProvider
