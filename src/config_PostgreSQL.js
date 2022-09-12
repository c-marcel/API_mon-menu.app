// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

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
            port: 3000
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
                database:   "db_name"       //< Database name.
            }
        }
    }
}

module.exports.Config = Config
