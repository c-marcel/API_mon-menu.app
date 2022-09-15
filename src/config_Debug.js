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
            port: 3000
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
