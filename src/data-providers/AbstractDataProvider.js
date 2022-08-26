// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

// Abstract object representing a data provider.
// Data providers must inherit from this class and implement
// the methods: connect(), getFoods(), getFoodData(), disconnect().
class AbstractDataProvider
{
    // The 'description' parameter is a string for describing each data provider.
    constructor(description)
    {
        this._description = description;
    }

    // Return the data provider description as text.
    description()
    {
        return this._description;
    }

    // Connect to data provider.
    // 'options' parameter is an object that contains all needed option.
    // Options content is defined by each data provider.
    // Return true on success
    connect(options)
    {
        // Do nothing by default.
        return false
    }

    // Get foods list (fields: id, title, details).
    // This method returns a Promise that will return data as JSON.
    getFoods()
    {
        return new Promise((resolve, reject) => { resolve(JSON.parse('{}'))})
    }

    // Get data for specific food identified by id field.
    // 'id' parameter is an integer that uniquely identify a database entry.
    // This method returns a Promise that will return data as JSON.
    getFoodData(id)
    {
        return new Promise((resolve, reject) => { resolve(JSON.parse('{}'))})
    }

    // Disconnect from data provider.
    disconnect(options)
    {
        // Do nothing by default.
    }
}

module.exports.AbstractDataProvider = AbstractDataProvider
