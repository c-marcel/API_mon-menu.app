// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

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

// Load configuration.
const g_config = new config.Config();

// Abstract object representing users manager.
// User managers must inherit from this class and implement
// the methods: connect(), getUserData(), isTokenValid(), disconnect().
//
// Note that getUserData() is not called directly but with a delay
// to avoid brute force attacks (through the getUserDataDelayed() function).
class AbstractUserManager
{
    // The 'description' parameter is a string for describing each manager.
    constructor(description)
    {
        this._description = description;
    }

    // Return the user manager description as text.
    description()
    {
        return this._description;
    }

    // Connect to user manager.
    // 'options' parameter is an object that contains all needed option.
    // Options content is defined by each user manager.
    // Return true on success
    connect(options)
    {
        // Do nothing by default.
        return false
    }

    // Get user data if credentials are valid.
    // This method returns a Promise that will return data as JSON.
    // 'username' is the user login.
    // 'password' is the user password before hash.
    // 'resolve' is the resolve function from the initial promise.
    getUserData(username, password, resolve)
    {
        return new Promise((r, reject) => { resolve({code: 501, data: null}) })
    }

    // Get user data if credentials are valid. Apply a delay defined into 
    // configuration to avoid brute force attacks.
    // This method returns a Promise that will return data as JSON.
    // 'username' is the user login.
    // 'password' is the user password before hash.
    getUserDataDelayed(username, password)
    {
        return new Promise(resolve => setTimeout(() => { this.getUserData(username, password, resolve) }, g_config.authentication.delayMs));
    }

    // Initialize user manager (e.g. database tables).
    init()
    {
        return new Promise((resolve, reject) => { resolve({code: 501, data: null}) })
    }

    // Disconnect from user manager.
    disconnect(options)
    {
        // Do nothing by default.
    }
}

module.exports.AbstractUserManager = AbstractUserManager
