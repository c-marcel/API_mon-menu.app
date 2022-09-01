// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

// Config object contains all the configuation parameters
// when executing the Api.
// This file shows configuration example for PostgreSQL data provider.
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
                type:       'postgresql',

                // Data provider option (object).
                options:
                {
                    host:       "localhost",    //< Hostname for the database server.
                    port:       5432,           //< Port used for PostgreSQL server.
                    user:       "username",     //< Username for connection.
                    password:   "password",     //< Password for connection.
                    database:   "db_name"       //< Database name.
                }
            },

            // Api token for private access.
            authenticationToken: "TOKEN"
        }
    }
}

module.exports.Config = Config