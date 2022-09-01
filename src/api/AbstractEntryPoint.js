// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

// The AbstractEntryPoint object is a base class representing an entry
// point for the Api. Each entry point must inherit from this parent
// class and implement the method executeImplementation().

// Try to load config file.
var config = null
try
{
    config = require('../config')
}
catch
{
    console.error("Fatal error: cannot find 'config.js' file into 'src' directory.")
    console.error("Please create 'src/config.js' file from provided templates.")

    process.exit([1]);
}

function createErrorAnswer(error, details)
{
    return JSON.parse('{"error": "' + error + '", "details": "' + details + '"}')
}

class AbstractEntryPoint
{
    // 'entryPoint' parameter is the name of the entry point.
    constructor(entryPoint)
    {
        this.entryPoint = entryPoint
        this.config     = new config.Config()

        // Needed to use 'this' by super when passing function pointer.
        this.exec = this.exec.bind(this)
    }

    setDataProvider(dataProvider)
    {
        this.dataProvider = dataProvider
    }

    exec(req, res)
    {
        // Check for authentification.
        // Based on a constant token defined into Http headers.
        let authToken = String(req.headers["auth-token"])
        if (authToken !== this.config.providers.authenticationToken)
        {
            res.status(401)
            res.send(createErrorAnswer('Authentication error', 
                                       'No auth-token HTTP header defined or bad token.'))
            return
        }

        this.executeImplementation(req, res)
    }

    executeImplementation(req, res)
    {
        // No implementation for entry point: return an error.
        console.error("No implementation for entry point: " + this.entryPoint)
        res.status(501)
        res.send(createErrorAnswer('Entry point without implementation', 
                                   'Internal Api error: this entry point has no implementation.'))
    }
}

module.exports.AbstractEntryPoint = AbstractEntryPoint
module.exports.createErrorAnswer  = createErrorAnswer
