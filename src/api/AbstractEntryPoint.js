// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

// The AbstractEntryPoint object is a base class representing an entry
// point for the Api. Each entry point must inherit from this parent
// class and implement the method executeImplementation().

// Try to load config file.
const config = require('../config')

function createErrorAnswer(error, details)
{
    return JSON.parse('{"error": "' + error + '", "details": "' + details + '"}')
}

class AbstractEntryPoint
{
    // 'entryPoint' parameter is the name of the entry point.
    // 'privateEntryPoint' parameter define if this entry point requires authentication check.
    constructor(entryPoint, privateEntryPoint)
    {
        this.entryPoint             = entryPoint
        this.authentificationNeeded = privateEntryPoint
        this.config                 = new config.Config()

        // Needed to use 'this' by super when passing function pointer.
        this.exec = this.exec.bind(this)
    }

    setDataProvider(dataProvider)
    {
        this.dataProvider = dataProvider
    }

    setUserManager(userManager)
    {
        this.userManager = userManager
    }

    // Get user level based on session data.
    getUserLevel(req)
    {
        if (!req.session)
            return ""

        if (!req.session.data)
            return ""

        if (!req.session.data.level)
            return ""

        return req.session.data.level
    }

    exec(req, res)
    {
        // Check for authentification.
        // Based on session data: level must be 'admin'.
        if (this.authentificationNeeded)
        {
            let userLevel = this.getUserLevel(req)
            if (userLevel != "admin")
            {
                res.status(401)
                res.send(createErrorAnswer('Authentication error', 
                                           'Access denied.'))
                return
            }
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
