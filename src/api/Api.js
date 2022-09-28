// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

// The installApi() method will install all entry points for the Api.
// Each entry point is implemented into a class in separate files.

// Entry point implementations.
var GetFoods                    = require('./foods/GetFoods')
var GetFoodData                 = require('./foods/GetFoodData')
var CreateFood                  = require('./foods/CreateFood')
var DeleteFood                  = require('./foods/DeleteFood')
var UpdateFood                  = require('./foods/UpdateFood')

var Connect                     = require('./users/Connect')
var Disconnect                  = require('./users/Disconnect')

var Dump                        = require('./tools/Dump')
var Restore                     = require('./tools/Restore')
var ComputeRecipeLinkedFields   = require ('./tools/ComputeRecipeLinkedFields')

var GetRecipeGroups             = require('./recipegroups/GetRecipeGroups')
var GetRecipeGroupData          = require('./recipegroups/GetRecipeGroupData')
var CreateRecipeGroup           = require('./recipegroups/CreateRecipeGroup')
var DeleteRecipeGroup           = require('./recipegroups/DeleteRecipeGroup')
var UpdateRecipeGroup           = require('./recipegroups/UpdateRecipeGroup')

var GetRecipeData               = require('./recipes/GetRecipeData')
var GetRecipeMetadata           = require('./recipes/GetRecipeMetadata')
var CreateRecipe                = require('./recipes/CreateRecipe')
var DeleteRecipe                = require('./recipes/DeleteRecipe')
var UpdateRecipe                = require('./recipes/UpdateRecipe')

var GetVersion                  = require('./configuration/getVersion')
var GetConfiguration            = require('./configuration/getConfiguration')

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
    installEntryPoint(app, dataProvider, userManager, '/getFoods',                  'GetFoods',                     'get'   )
    installEntryPoint(app, dataProvider, userManager, '/getFoodData/:id',           'GetFoodData',                  'get'   )
    installEntryPoint(app, dataProvider, userManager, '/createFood',                'CreateFood',                   'post'  )
    installEntryPoint(app, dataProvider, userManager, '/deleteFood/:id',            'DeleteFood',                   'delete')
    installEntryPoint(app, dataProvider, userManager, '/updateFood',                'UpdateFood',                   'put'   )

    installEntryPoint(app, dataProvider, userManager, '/connect',                   'Connect',                      'get'   )
    installEntryPoint(app, dataProvider, userManager, '/disconnect',                'Disconnect',                   'get'   )

    installEntryPoint(app, dataProvider, userManager, '/dump',                      'Dump',                         'get'   )
    installEntryPoint(app, dataProvider, userManager, '/restore',                   'Restore',                      'post'  )
    installEntryPoint(app, dataProvider, userManager, '/computeRecipeLinkedFields',  'ComputeRecipeLinkedFields',   'post'  )

    installEntryPoint(app, dataProvider, userManager, '/getRecipeGroups',           'GetRecipeGroups',              'get'   )
    installEntryPoint(app, dataProvider, userManager, '/getRecipeGroupData/:id',    'GetRecipeGroupData',           'get'   )
    installEntryPoint(app, dataProvider, userManager, '/createRecipeGroup',         'CreateRecipeGroup',            'post'  )
    installEntryPoint(app, dataProvider, userManager, '/deleteRecipeGroup/:id',     'DeleteRecipeGroup',            'delete')
    installEntryPoint(app, dataProvider, userManager, '/updateRecipeGroup',         'UpdateRecipeGroup',            'put'   )

    installEntryPoint(app, dataProvider, userManager, '/getRecipeMetadata/:id',     'GetRecipeMetadata',            'get'   )
    installEntryPoint(app, dataProvider, userManager, '/getRecipeData/:id',         'GetRecipeData',                'get'   )
    installEntryPoint(app, dataProvider, userManager, '/createRecipe',              'CreateRecipe',                 'post'  )
    installEntryPoint(app, dataProvider, userManager, '/deleteRecipe/:id',          'DeleteRecipe',                 'delete')
    installEntryPoint(app, dataProvider, userManager, '/updateRecipe',              'UpdateRecipe',                 'put'   )

    installEntryPoint(app, dataProvider, userManager, '/getVersion',                'GetVersion',                   'get'   )
    installEntryPoint(app, dataProvider, userManager, '/getConfiguration',          'GetConfiguration',             'get'   )
}

module.exports = { installApi }
