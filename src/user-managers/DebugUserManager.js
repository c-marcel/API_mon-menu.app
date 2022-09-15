// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

// This user manager ('debug') is a local and volatile database
// for debug purpose only.
// This provider requires no options.

var Parent = require('./AbstractUserManager')
var bcrypt = require("bcrypt")

// gDebugUserManagerData object stores some data for debug purposes.
var gDebugUserManagerData =
{
    users:
    [
        {
            id:             1,
            username:       "admin",
            passwordHash:   "PASSWORD_HASH",
            level:          "admin",
            authentication:
            {
                token:      "TOKEN"
            }
        }
    ]
}

class DebugUserManager extends Parent.AbstractUserManager
{
    constructor()
    {
        super("Local and volatile users manager. For debug only.");
    }

    connect(options)
    {
        return true
    }

    getUserData(username, password)
    {
        var promise = new Promise((resolve, reject) =>
        {
            let userNotFound = true;

            for (let i = 0 ; i < gDebugUserManagerData.users.length ; i++)
            {
                let entry = gDebugUserManagerData.users.at(i)
                if (entry.username == username)
                {
                    userNotFound = false;

                    bcrypt.compare(password, entry.passwordHash, function(err, result)
                    {
                        if (result)
                            resolve({code: 200, data: {level: entry.level, token: entry.authentication.token}})
                        
                        else
                            resolve({code: 401, data: null})

                        return
                    });
                }
            }
            
            if (userNotFound)
                resolve({code: 401, data: null})
        })

        return promise
    }

    isTokenValid(token)
    {
        for (let i = 0 ; i < gDebugUserManagerData.users.length ; i++)
        {
            let entry = gDebugUserManagerData.users.at(i)
            if (entry.authentication.token == token)
                return true
        }

        // Token not found.
        return false
    }
}

module.exports.DebugUserManager = DebugUserManager
