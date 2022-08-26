// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

// This data provider ('postgresql') connects to a PostgreSQL database.
// Connection options are:
// * 'host': database server host
// * 'port': database server port
// * 'user': database server username
// * 'password': database server password
// * 'database': database name

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
            this.pool.query("INSERT INTO foods (title) VALUES (NULL) RETURNING id").then(function(res)
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
                                              nutrition = $7 \
                                              WHERE id = $8 RETURNING *", [object.title,
                                                               object.details,
                                                               object.months,
                                                               object.supplyArea,
                                                               object.cost,
                                                               object.environmentalImpact,
                                                               object.nutrition,
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
