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

                resolve(data)
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
                for (let i = 0 ; i < res.rowCount ; i++)
                {
                    var item = res.rows[i]
                    data.foods.push(item)
                }

                resolve(data)
            })
        })

        return promise
    }
}

module.exports.PostgreSQLDataProvider = PostgreSQLDataProvider
