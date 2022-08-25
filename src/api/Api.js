// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

// The installApi() method will install all entry points for the Api.
// Each entry point is implemented into a class in separate files.

// Entry point implementations.
var GetFoods    = require('./GetFoods')
var GetFoodData = require('./GetFoodData')

// Install a specific entry point.
// 'app' parameter is the express application.
// 'dataProvider' parameter is the data provider object.
// 'entryPoint' parameter is the name of the entry point (e.g. '/getFoods').
// 'implementation' parameter is the name of the class (as string) that
//                  implements the entry point (e.g. 'GetFoods').
function installEntryPoint(app, dataProvider, entryPoint, implementation)
{
    // Instanciate implementation.
    var instance = null
    
    try
    {
        instance = eval('new ' + implementation + '.' + implementation)
    }
    catch (error)
    {
        console.error('Error: cannot mount entry point \'' + entryPoint + '\'. Implementation not found: \'' + implementation + '\'')
    }
    
    if (!instance)
        return

    // Define data provider.
    instance.setDataProvider(dataProvider)
    
    // Install entry point.
    console.log('Mounting entry point: ' + entryPoint)
    app.get(entryPoint, instance.exec)
}

function installApi(app, dataProvider)
{
    // Install all entry points.
    installEntryPoint(app, dataProvider, '/getFoods',    'GetFoods')
    installEntryPoint(app, dataProvider, '/getFoodData/:id', 'GetFoodData')
}

module.exports = { installApi }
