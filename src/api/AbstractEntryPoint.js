// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

// The AbstractEntryPoint object is a base class representing an entry
// point for the Api. Each entry point must inherit from this parent
// class and implement the method executeImplementation().

function createErrorAnswer(error, details)
{
    return '{"error": "' + error + '", "details": "' + details + '"}'
}

// Authentication token.
// In the current version, authentication is done through a hard-coded
// token that must be passed into Http(s) header 'auth-token'.
const ApiConstantToken = '1e91ccce-9a8d-45a8-8d72-0decd3549a12'

class AbstractEntryPoint
{
    // 'entryPoint' parameter is the name of the entry point.
    constructor(entryPoint)
    {
        this.entryPoint = entryPoint

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
        if (authToken !== ApiConstantToken)
        {
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
        res.send(createErrorAnswer('Entry point without implementation', 
                                   'Internal Api error: this entry point has no implementation.'))
    }
}

module.exports.AbstractEntryPoint = AbstractEntryPoint
module.exports.createErrorAnswer  = createErrorAnswer
