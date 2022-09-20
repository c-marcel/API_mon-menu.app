// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

// This factory creates a data provider by providing its type.
// Available types:
// 'postgresql' - PostgreSQL database connection.

var PostgreSQLDataProvider = require('./PostgreSQLDataProvider')

// Create a data provider by type.
// Return null on error.
function createDataProvider(type)
{
    if (type === 'postgresql')
        return new PostgreSQLDataProvider.PostgreSQLDataProvider();

    // Type not found.
    return null;
}

module.exports = { createDataProvider }
