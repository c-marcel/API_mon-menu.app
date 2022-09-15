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

const pgp = require('pg-promise')();

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

    getFoodData(id)
    {
        var promise = new Promise((resolve, reject) =>
        {
            var data = {foods: []}

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

    createFood()
    {
        var promise = new Promise((resolve, reject) =>
        {
            this.pool.query("INSERT INTO foods (title, details, months, \"supplyArea\", cost, \"environmentalImpact\", nutrition) VALUES ('', '', ARRAY[]::integer[], 0, 0.0, '{ \"co2eq\": { \"kgco2e_kg\": 0.0, \"source\": \"\" } }', '{ \"energy\": { \"value\": 0.0, \"source\": \"\" }, \"proteins\": { \"value\": 0.0, \"source\": \"\" }, \"carbohydrates\": { \"value\": 0.0, \"source\": \"\" }, \"lipids\": { \"value\": 0.0, \"source\": \"\" }, \"sugars\": { \"value\": 0.0, \"source\": \"\" }, \"fibers\": { \"value\": 0.0, \"source\": \"\" }, \"omega3_ala\": { \"value\": 0.0, \"source\": \"\" }, \"omega3_epa\": { \"value\": 0.0, \"source\": \"\" }, \"omega3_dha\": { \"value\": 0.0, \"source\": \"\" }, \"omega6_la\": { \"value\": 0.0, \"source\": \"\" }, \"omega6_ara\": { \"value\": 0.0, \"source\": \"\" }, \"omega9\": { \"value\": 0.0, \"source\": \"\" }, \"salt\": { \"value\": 0.0, \"source\": \"\" }, \"calcium\": { \"value\": 0.0, \"source\": \"\" }, \"copper\": { \"value\": 0.0, \"source\": \"\" }, \"iron\": { \"value\": 0.0, \"source\": \"\" }, \"iodine\": { \"value\": 0.0, \"source\": \"\" }, \"magnesium\": { \"value\": 0.0, \"source\": \"\" }, \"sodium\": { \"value\": 0.0, \"source\": \"\" }, \"zinc\": { \"value\": 0.0, \"source\": \"\" }, \"vitamin_c\": { \"value\": 0.0, \"source\": \"\" }, \"vitamin_d\": { \"value\": 0.0, \"source\": \"\" } }') RETURNING id").then(function(res)
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

    dump()
    {
        var promise = new Promise((resolve, reject) =>
        {
            var data = {foods: []}

            this.pool.query("SELECT * FROM foods").then(function(res)
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

        return promise;
    }

    restore(data)
    {
        var promise = new Promise((resolve, reject) =>
        {
            let lthis = this;

            // Drop create table.
            this.pool.query("DROP TABLE foods").then(function(res)
            {
                // Create table.
                lthis.pool.query("CREATE TABLE foods (id bigint NOT NULL GENERATED ALWAYS AS IDENTITY, title text, details text, months integer[], \"supplyArea\" integer, cost double precision, \"environmentalImpact\" json, nutrition json, units json, PRIMARY KEY(id));").then(function(res)
                {
                    // Add all data.
                    const queries = [];

                    for (let i = 0 ; i < data.foods.length ; i++)
                    {
                        var entry = data.foods[i];
                        var query = 
                        {
                            query:  "INSERT INTO foods (title, details, months, \"supplyArea\", cost, \"environmentalImpact\", nutrition, units) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
                            values:
                            [
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

                    const sql = pgp.helpers.concat(queries);
                    
                    lthis.pool.query(sql).then(function(res)
                    {
                        resolve({code: 200, data: null})
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

        return promise;
    }
}

module.exports.PostgreSQLDataProvider = PostgreSQLDataProvider
