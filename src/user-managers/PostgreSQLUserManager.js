// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

// This user manager ('postgresql') connects to a PostgreSQL database.
// Connection options are:
// * 'host': database server host
// * 'port': database server port
// * 'user': database server username
// * 'password': database server password
// * 'database': database name

var Client = require('pg-native');

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
        this.client = new Client()
        this.client.connectSync("postgresql://" + options.user + ":" + options.password + "@" + options.host + ":" + options.port + "/" + options.database)
        return true
    }

    disconnect(options)
    {
        this.client = null
    }

    getUserData(username, password, resolve)
    {
        var promise = new Promise((r, reject) =>
        {
            let res = this.client.querySync("SELECT * FROM users WHERE username = $1", [username])

            if (res.length == 0)
            {
                resolve({code: 401, data: null})
            }

            else if (res.length == 1)
            {
                bcrypt.compare(password, res[0].passwordHash, function(err, result)
                {
                    if (result)
                    {
                        resolve({code: 200, data: {level: res[0].level}})
                    }
                    
                    else
                        resolve({code: 401, data: null})
                });
            }

            else
            {
                resolve({code: 500, data: null})
            }
        })

        return promise
    }
}

module.exports.PostgreSQLUserManager = PostgreSQLUserManager
