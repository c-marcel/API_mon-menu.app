// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

// Config object contains all the configuration parameters
// when executing the Api.
// This file shows configuration example for PostgreSQL provider.
class Config
{
    constructor()
    {
        // Api server options.
        this.server = 
        {
            // Port on which Api will serve.
            port: 3000,

            // Host (i.e. interface used).
            host: "127.0.0.1",

            // Cookies options.
            cookies:
            {
                secret:             ["secret1", "secret2"],
                saveUninitialized:  false
            },

            // Connection options.
            connection:
            {
                secure:         true,                   //< If set to 'true' use https. 'privateKey' and 'certificate' must be set.
                privateKey:     "my-private.key",       //< Private key filename.
                certificate:    "my-certificate.crt"    //< Certificate filename.
            }
        }

        // Api providers options.
        this.provider =
        {
            // Provider type: 'debug' or 'postgresql'.
            type:       'postgresql',

            // Provider option (object).
            options:
            {
                host:       "localhost",    //< Hostname for the database server.
                port:       5432,           //< Port used for PostgreSQL server.
                user:       "username",     //< Username for connection.
                password:   "password",     //< Password for connection.
                database:   "db_name",      //< Database name.
                prefix:     "prefix"        //< Table names prefix.
            }
        }

        // Authentication options.
        this.authentication =
        {
            // Authentication delay in ms.
            delayMs:    500
        }
    }
}

module.exports.Config = Config
