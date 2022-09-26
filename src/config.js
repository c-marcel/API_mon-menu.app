// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

// Config for tests.
class Config
{
    constructor()
    {
        // Api server options.
        this.server = 
        {
            port: 3000,
            host: "127.0.0.1",
            cookies:
            {
                secret:             ["secret1", "secret2"],
                saveUninitialized:  false
            },
            connection:
            {
                secure:         false,
                privateKey:     "",
                certificate:    ""
            }
        }

        this.provider =
        {
            type:       'postgresql',
            options:
            {
                host:       "localhost",
                port:       15432,
                user:       "mmau",
                password:   "mmapwd",
                database:   "mon-menu.app",
                prefix:     "tmppre"
            }
        }

        this.authentication =
        {
            delayMs:    500
        }
    }
}

module.exports.Config = Config
