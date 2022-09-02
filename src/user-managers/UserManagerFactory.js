// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

// This factory creates an user manager by providing its type.
// Available types:
// 'debug' - local and volatile manager (for debug purpose only).
// 'postgresql' - PostgreSQL database connection.

var PostgreSQLUserManager = require('./PostgreSQLUserManager')
var DebugUserManager = require('./DebugUserManager')

// Create a data provider by type.
// Return null on error.
function createUserManager(type)
{
    if (type === 'debug')
        return new DebugUserManager.DebugUserManager();

    if (type === 'postgresql')
        return new PostgreSQLUserManager.PostgreSQLUserManager();

    // Type not found.
    return null;
}

module.exports = { createUserManager }
