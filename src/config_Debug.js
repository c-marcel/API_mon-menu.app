// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

// Config object contains all the configuration parameters
// when executing the Api.
// This file shows configuration example for Debug provider.
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
                secure:         false,  //< If set to 'true' use https. 'privateKey' and 'certificate' must be set.
                privateKey:     "",     //< Private key filename.
                certificate:    ""      //< Certificate filename.
            }
        }

        // Api provider for data and users.
        this.provider =
        {
            // Provider type: 'debug' or 'postgresql'.
            type:       'debug',

            // Provider option (object).
            options:    null
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
