// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

// This factory creates an user manager by providing its type.
// Available types:
// 'postgresql' - PostgreSQL database connection.

var PostgreSQLUserManager = require('./PostgreSQLUserManager')

// Create a data provider by type.
// Return null on error.
function createUserManager(type)
{
    if (type === 'postgresql')
        return new PostgreSQLUserManager.PostgreSQLUserManager();

    // Type not found.
    return null;
}

module.exports = { createUserManager }
