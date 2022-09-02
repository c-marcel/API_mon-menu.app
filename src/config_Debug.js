// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

// Config object contains all the configuation parameters
// when executing the Api.
// This file shows configuration example for Debug data provider.
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

        // Api providers options.
        this.providers =
        {
            // Api data providers options.
            data:
            {
                // Data provider type. See src/data-providers.
                type:       'debug',

                // Data provider option (object).
                options:    null
            },

            // Api user manager options.
            users:
            {
                // Data provider type. See src/user-managers.
                type: 'debug',
                
                // User manager option (object).
                options:    null
            }
        }
    }
}

module.exports.Config = Config
