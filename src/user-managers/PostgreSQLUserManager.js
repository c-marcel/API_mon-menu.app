// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

// This user manager ('postgresql') connects to a PostgreSQL database.
// Connection options are:
// * 'host': database server host
// * 'port': database server port
// * 'user': database server username
// * 'password': database server password
// * 'database': database name

const { Pool } = require("pg");

var Parent = require('./AbstractUserManager')
var bcrypt = require("bcrypt")

class PostgreSQLUserManager extends Parent.AbstractUserManager
{
    constructor()
    {
        super("PostegreSQL database user manager.");
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

    getUserData(username, password)
    {
        var promise = new Promise((resolve, reject) =>
        {
            this.pool.query("SELECT * FROM users WHERE username = $1", [username]).then(function(res)
            {
                if (res.rowCount == 0)
                {
                    resolve({code: 401, data: null})
                }

                else if (res.rowCount == 1)
                {
                    bcrypt.compare(password, res.rows[0].passwordHash, function(err, result)
                    {
                        if (result)
                            resolve({code: 200, data: {level: res.rows[0].level, token: res.rows[0].authToken}})
                        
                        else
                            resolve({code: 401, data: null})
                    });
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
}

module.exports.PostgreSQLUserManager = PostgreSQLUserManager
