// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

// Abstract object representing an users manager.
// User managers must inherit from this class and implement
// the methods: connect(), getUserData(), isTokenValid(), disconnect().
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
    getUserData(username, password)
    {
        return new Promise((resolve, reject) => { resolve(JSON.parse('{}'))})
    }

    // Check if authentication token is valid.
    // This method return true is token is valid.
    // 'token' is the token to be tested.
    isTokenValid(token)
    {
        return false
    }

    // Disconnect from user manager.
    disconnect(options)
    {
        // Do nothing by default.
    }
}

module.exports.AbstractUserManager = AbstractUserManager
