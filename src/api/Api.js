// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

// The installApi() method will install all entry points for the Api.
// Each entry point is implemented into a class in separate files.

// Entry point implementations.
var GetFoods    = require('./GetFoods')
var GetFoodData = require('./GetFoodData')
var CreateFood  = require('./CreateFood')
var DeleteFood  = require('./DeleteFood')
var UpdateFood  = require('./UpdateFood')
var Connect     = require('./Connect')

// Install a specific entry point.
// 'app' parameter is the express application.
// 'dataProvider' parameter is the data provider object.
// 'entryPoint' parameter is the name of the entry point (e.g. '/getFoods').
// 'implementation' parameter is the name of the class (as string) that
//                  implements the entry point (e.g. 'GetFoods').
// 'method' parameter defines HTTP verb. Default is 'get'. 
//          Supported: 'get', 'put', 'post', 'delete'.
function installEntryPoint(app, dataProvider, userManager, entryPoint, implementation, method = 'get')
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

    // Define user manager.
    instance.setUserManager(userManager)
    
    // Install entry point.
    console.log('Mounting entry point: ' + entryPoint)
    if (method === 'get')
        app.get(entryPoint, instance.exec)

    else if (method === 'put')
        app.put(entryPoint, instance.exec)

    else if (method === 'post')
        app.post(entryPoint, instance.exec)

    else if (method === 'delete')
        app.delete(entryPoint, instance.exec)
}

function installApi(app, dataProvider, userManager)
{
    // Install all entry points.
    installEntryPoint(app, dataProvider, userManager, '/getFoods',        'GetFoods',    'get'   )
    installEntryPoint(app, dataProvider, userManager, '/getFoodData/:id', 'GetFoodData', 'get'   )
    installEntryPoint(app, dataProvider, userManager, '/createFood',      'CreateFood',  'post'  )
    installEntryPoint(app, dataProvider, userManager, '/deleteFood/:id',  'DeleteFood',  'delete')
    installEntryPoint(app, dataProvider, userManager, '/updateFood',      'UpdateFood',  'put'   )
    installEntryPoint(app, dataProvider, userManager, '/connect',         'Connect',     'get'   )
}

module.exports = { installApi }
