// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

var axios  = require('axios')
var exec   = require('child_process').exec
var Client = require('pg-native');
var config = require('../src/config')
var bcrypt = require("bcrypt")

jest.setTimeout(30000)

const cfg = new config.Config();

// Define constants.
const g_docker_name     = "mon-menu.app"
const g_database_name   = "mon-menu.app"
const g_hostname        = "localhost"
const g_password        = "mmapwd"
const g_user            = "mmau"
const g_port            = 15432

const g_valid_username  = "admin"
const g_valid_password  = "mypass"

// Store cookie for session.
var g_cookie = ""

// Get base url for Api.
function getBaseUrl()
{
    return 'http' + (cfg.server.connection.secure ? 's' : '') + '://' + (cfg.server.host) + ':' + (cfg.server.port)
}

// Start database server.
beforeAll(() =>
{
    return new Promise((resolve, reject) =>
    {
        exec('docker run --name "' + g_docker_name + '" -e POSTGRES_PASSWORD=' + g_password + ' -e POSTGRES_USER=' + g_user + ' -e POSTGRES_DB="' + g_database_name + '" -d -p ' + g_port + ':5432 postgres', (error, stdout, stderr) => 
        {
            if (error)
            {
                reject()
            }

            else
            {
                // Wait for container has started.
                setTimeout(() => 
                {
                    // Initialize database.
                    exec('npm run init', (error, stdout, stderr) => 
                    {
                        if (error)
                        {
                            reject()
                        }

                        else
                        {
                            // Start Api.
                            exec('pm2 start node -- ./index.js', (error, stdout, stderr) => 
                            {
                                if (error)
                                {
                                    reject()
                                }

                                else
                                {
                                    // Wait for Api has started.
                                    setTimeout(resolve, 5000)
                                }
                            })
                        }
                    })
                }, 5000);
            }
        });
    })
});

function promiseForHttpSuccess(verb, entryPoint, code, checkCallback = undefined, data = '')
{
    return new Promise((resolve, reject) =>
    {
        let url = getBaseUrl() + '/' + entryPoint
        
        axios(
        {
            method: verb.toLowerCase(),
            url:    url,
            data:   data,
            headers:
            {
                "Cookie": g_cookie
            }
        }).then((response) =>
        {
            if (response.status == code)
            {
                // Save cookie.
                if (response.headers['set-cookie'])
                {
                    g_cookie = response.headers['set-cookie']
                }

                if (checkCallback != undefined)
                {
                    checkCallback(resolve, reject, response.data)
                }

                resolve()
            }

            reject()
        }).catch((response) =>
        {
            reject()
        })
    })
}

function promiseForHttpError(verb, entryPoint, code)
{
    return new Promise((resolve, reject) =>
    {
        let url = getBaseUrl() + '/' + entryPoint
        
        axios(
        {
            method: verb.toLowerCase(),
            url:    url,
            headers:
            {
                "Cookie": g_cookie
            }
        }).then((response) =>
        {
            reject()
        }).catch((e) =>
        {
            if (e.response.status == code)
            {
                resolve()
            }

            reject()
        })
    })
}

function promiseForDatabaseConnection(host, port, user, password, database, errorOnConnection = false)
{
    return new Promise((resolve, reject) =>
    {
        var client = new Client()

        try
        {
            client.connectSync("postgresql://" + user + ":" + password + "@" + host + ":" + port + "/" + database)    
        } catch (error)
        {
            client = null

            if (errorOnConnection)
                resolve()
            
            else
                reject()
        }

        client = null

        if (errorOnConnection)
            reject()

        else
            resolve()
    })
}

// Test connection to database.
describe('Database connection', () =>
{
    test('Successfull connection', () =>
    {
        return promiseForDatabaseConnection(g_hostname, g_port, g_user, g_password, g_database_name)
    })

    test('Bad localhost', () =>
    {
        return promiseForDatabaseConnection("bad", g_port, g_user, g_password, g_database_name, true)
    })

    test('Bad port', () =>
    {
        return promiseForDatabaseConnection(g_hostname, 8083, g_user, g_password, g_database_name, true)
    })

    test('Bad user', () =>
    {
        return promiseForDatabaseConnection(g_hostname, g_port, "baduser", g_password, g_database_name, true)
    })

    test('Bad password', () =>
    {
        return promiseForDatabaseConnection(g_hostname, g_port, g_user, "badpassword", g_database_name, true)
    })

    test('Bad database', () =>
    {
        return promiseForDatabaseConnection(g_hostname, g_port, g_user, g_password, "bad-database", true)
    })

    test('Add admin user', () =>
    {
        return new Promise((resolve, reject) =>
        {
            var client = new Client()

            try
            {
                client.connectSync("postgresql://" + g_user + ":" + g_password + "@" + g_hostname + ":" + g_port + "/" + g_database_name)    
            } catch (error)
            {
                client = null
                reject()
            }

            const hash = bcrypt.hashSync(g_valid_password, 10);

            // Add user.
            var rows = client.querySync('INSERT INTO ' + cfg.provider.options.prefix + '_users (username, "passwordHash", level) VALUES (\'' + g_valid_username + '\', \'' + hash + '\', \'admin\')')

            client = null
            resolve()
        })
    })
})

// Test connection to database.
describe('Api version and configuration', () =>
{
    test('Api access and version', () =>
    {
        return promiseForHttpSuccess('GET', 'getVersion', 200, (resolve, reject, data) =>
        {
            if (data.version == '1')
                resolve()

            reject()
        })
    })

    test('Api configuration fields', () =>
    {
        return promiseForHttpSuccess('GET', 'getConfiguration', 200, (resolve, reject, data) =>
        {
            if (!data.hasOwnProperty('data_co2'))
                reject()

            let data_co2 = data.data_co2
            
            if (!data_co2.hasOwnProperty('co2eq_kwh_electricity'))
                reject()

            if (!data_co2.hasOwnProperty('co2eq_kwh_gas'))
                reject()

            if (typeof data_co2.co2eq_kwh_electricity != 'number')
                reject()

            if (typeof data_co2.co2eq_kwh_gas != 'number')
                reject()

            if (data_co2.co2eq_kwh_electricity <= 0.0)
                reject()

            if (data_co2.co2eq_kwh_gas <= 0.0)
                reject()

            resolve()
        })
    })
})

// Test Api HTTP code without authentication.
describe('Api Http code without authentication (version/configuration)', () =>
{
    // getVersion
    test('getVersion (GET Http 200)', () =>
    {
        return promiseForHttpSuccess('GET', 'getVersion', 200)
    })

    test('getVersion (POST Http 404)', () =>
    {
        return promiseForHttpError('POST', 'getVersion', 404)
    })

    test('getVersion (PUT Http 404)', () =>
    {
        return promiseForHttpError('PUT', 'getVersion', 404)
    })

    test('getVersion (DELETE Http 404)', () =>
    {
        return promiseForHttpError('DELETE', 'getVersion', 404)
    })

    // getConfiguration
    test('getConfiguration (GET Http 200)', () =>
    {
        return promiseForHttpSuccess('GET', 'getConfiguration', 200)
    })

    test('getConfiguration (POST Http 404)', () =>
    {
        return promiseForHttpError('POST', 'getConfiguration', 404)
    })

    test('getConfiguration (PUT Http 404)', () =>
    {
        return promiseForHttpError('PUT', 'getConfiguration', 404)
    })

    test('getConfiguration (DELETE Http 404)', () =>
    {
        return promiseForHttpError('DELETE', 'getConfiguration', 404)
    })
})

describe('Api Http code without authentication (foods)', () =>
{
    // getFoods
    test('getFoods (GET Http 200)', () =>
    {
        return promiseForHttpSuccess('GET', 'getFoods', 200)
    })

    test('getFoods (POST Http 404)', () =>
    {
        return promiseForHttpError('POST', 'getFoods', 404)
    })

    test('getFoods (PUT Http 404)', () =>
    {
        return promiseForHttpError('PUT', 'getFoods', 404)
    })

    test('getFoods (DELETE Http 404)', () =>
    {
        return promiseForHttpError('DELETE', 'getFoods', 404)
    })

    // getFoodData
    test('getFoodData (GET Http 404)', () =>
    {
        return promiseForHttpError('GET', 'getFoodData/invalid-id', 404)
    })

    test('getFoodData (POST Http 404)', () =>
    {
        return promiseForHttpError('POST', 'getFoodData', 404)
    })

    test('getFoodData (PUT Http 404)', () =>
    {
        return promiseForHttpError('PUT', 'getFoodData', 404)
    })

    test('getFoodData (DELETE Http 404)', () =>
    {
        return promiseForHttpError('DELETE', 'getFoodData', 404)
    })

    // createFood
    test('createFood (POST Http 401)', () =>
    {
        return promiseForHttpError('POST', 'createFood', 401)
    })

    test('createFood (GET Http 404)', () =>
    {
        return promiseForHttpError('GET', 'createFood', 404)
    })

    test('createFood (PUT Http 404)', () =>
    {
        return promiseForHttpError('PUT', 'createFood', 404)
    })

    test('createFood (DELETE Http 404)', () =>
    {
        return promiseForHttpError('DELETE', 'createFood', 404)
    })

    // deleteFood
    test('deleteFood (DELETE Http 401)', () =>
    {
        return promiseForHttpError('DELETE', 'deleteFood/invalid-id', 401)
    })

    test('deleteFood (POST Http 404)', () =>
    {
        return promiseForHttpError('POST', 'deleteFood', 404)
    })

    test('deleteFood (GET Http 404)', () =>
    {
        return promiseForHttpError('GET', 'deleteFood', 404)
    })

    test('deleteFood (PUT Http 404)', () =>
    {
        return promiseForHttpError('PUT', 'deleteFood', 404)
    })

    // updateFood
    test('updateFood (PUT Http 401)', () =>
    {
        return promiseForHttpError('PUT', 'updateFood', 401)
    })

    test('updateFood (DELETE Http 404)', () =>
    {
        return promiseForHttpError('DELETE', 'updateFood', 404)
    })

    test('updateFood (POST Http 404)', () =>
    {
        return promiseForHttpError('POST', 'updateFood', 404)
    })

    test('updateFood (GET Http 404)', () =>
    {
        return promiseForHttpError('GET', 'updateFood', 404)
    })
})

describe('Api Http code without authentication (tools)', () =>
{
    // dump.
    test('dump (GET Http 401)', () =>
    {
        return promiseForHttpError('GET', 'dump', 401)
    })

    test('dump (POST Http 404)', () =>
    {
        return promiseForHttpError('POST', 'dump', 404)
    })

    test('dump (PUT Http 404)', () =>
    {
        return promiseForHttpError('PUT', 'dump', 404)
    })

    test('dump (DELETE Http 404)', () =>
    {
        return promiseForHttpError('DELETE', 'dump', 404)
    })

    // restore.
    test('restore (GET Http 404)', () =>
    {
        return promiseForHttpError('GET', 'restore', 404)
    })

    test('restore (POST Http 401)', () =>
    {
        return promiseForHttpError('POST', 'restore', 401)
    })

    test('restore (PUT Http 404)', () =>
    {
        return promiseForHttpError('PUT', 'restore', 404)
    })

    test('restore (DELETE Http 404)', () =>
    {
        return promiseForHttpError('DELETE', 'restore', 404)
    })
})

describe('Api Http code without authentication (recipegroups)', () =>
{
    // getRecipeGroups
    test('getRecipeGroups (GET Http 200)', () =>
    {
        return promiseForHttpSuccess('GET', 'getRecipeGroups', 200)
    })

    test('getRecipeGroups (POST Http 404)', () =>
    {
        return promiseForHttpError('POST', 'getRecipeGroups', 404)
    })

    test('getRecipeGroups (PUT Http 404)', () =>
    {
        return promiseForHttpError('PUT', 'getRecipeGroups', 404)
    })

    test('getRecipeGroups (DELETE Http 404)', () =>
    {
        return promiseForHttpError('DELETE', 'getRecipeGroups', 404)
    })

    // getRecipeGroupData
    test('getRecipeGroupData (GET Http 404)', () =>
    {
        return promiseForHttpError('GET', 'getRecipeGroupData/invalid-id', 404)
    })

    test('getRecipeGroupData (POST Http 404)', () =>
    {
        return promiseForHttpError('POST', 'getRecipeGroupData/invalid-id', 404)
    })

    test('getRecipeGroupData (PUT Http 404)', () =>
    {
        return promiseForHttpError('PUT', 'getRecipeGroupData/invalid-id', 404)
    })

    test('getRecipeGroupData (DELETE Http 404)', () =>
    {
        return promiseForHttpError('DELETE', 'getRecipeGroupData/invalid-id', 404)
    })

    // createRecipeGroup
    test('createRecipeGroup (GET Http 404)', () =>
    {
        return promiseForHttpError('GET', 'createRecipeGroup', 404)
    })

    test('createRecipeGroup (POST Http 401)', () =>
    {
        return promiseForHttpError('POST', 'createRecipeGroup', 401)
    })

    test('createRecipeGroup (PUT Http 404)', () =>
    {
        return promiseForHttpError('PUT', 'createRecipeGroup', 404)
    })

    test('createRecipeGroup (DELETE Http 404)', () =>
    {
        return promiseForHttpError('DELETE', 'createRecipeGroup', 404)
    })

    // deleteRecipeGroup
    test('deleteRecipeGroup (GET Http 404)', () =>
    {
        return promiseForHttpError('GET', 'deleteRecipeGroup/invalid-id', 404)
    })

    test('deleteRecipeGroup (POST Http 404)', () =>
    {
        return promiseForHttpError('POST', 'deleteRecipeGroup/invalid-id', 404)
    })

    test('deleteRecipeGroup (PUT Http 404)', () =>
    {
        return promiseForHttpError('PUT', 'deleteRecipeGroup/invalid-id', 404)
    })

    test('deleteRecipeGroup (DELETE Http 401)', () =>
    {
        return promiseForHttpError('DELETE', 'deleteRecipeGroup/invalid-id', 401)
    })

    // updateRecipeGroup
    test('updateRecipeGroup (GET Http 404)', () =>
    {
        return promiseForHttpError('GET', 'updateRecipeGroup', 404)
    })

    test('updateRecipeGroup (POST Http 404)', () =>
    {
        return promiseForHttpError('POST', 'updateRecipeGroup', 404)
    })

    test('updateRecipeGroup (PUT Http 401)', () =>
    {
        return promiseForHttpError('PUT', 'updateRecipeGroup', 401)
    })

    test('updateRecipeGroup (DELETE Http 404)', () =>
    {
        return promiseForHttpError('DELETE', 'updateRecipeGroup', 404)
    })
})

describe('Api Http code without authentication (recipes)', () =>
{
    // getRecipeMetadata
    test('getRecipeMetadata (GET Http 404)', () =>
    {
        return promiseForHttpError('GET', 'getRecipeMetadata/invalid-id', 404)
    })

    test('getRecipeMetadata (POST Http 404)', () =>
    {
        return promiseForHttpError('POST', 'getRecipeMetadata/invalid-id', 404)
    })

    test('getRecipeMetadata (PUT Http 404)', () =>
    {
        return promiseForHttpError('PUT', 'getRecipeMetadata/invalid-id', 404)
    })

    test('getRecipeMetadata (DELETE Http 404)', () =>
    {
        return promiseForHttpError('DELETE', 'getRecipeMetadata/invalid-id', 404)
    })

    // getRecipeData
    test('getRecipeData (GET Http 404)', () =>
    {
        return promiseForHttpError('GET', 'getRecipeData/invalid-id', 404)
    })

    test('getRecipeData (POST Http 404)', () =>
    {
        return promiseForHttpError('POST', 'getRecipeData/invalid-id', 404)
    })

    test('getRecipeData (PUT Http 404)', () =>
    {
        return promiseForHttpError('PUT', 'getRecipeData/invalid-id', 404)
    })

    test('getRecipeData (DELETE Http 404)', () =>
    {
        return promiseForHttpError('DELETE', 'getRecipeData/invalid-id', 404)
    })

    // createRecipe
    test('createRecipe (GET Http 404)', () =>
    {
        return promiseForHttpError('GET', 'createRecipe', 404)
    })

    test('createRecipe (POST Http 401)', () =>
    {
        return promiseForHttpError('POST', 'createRecipe', 401)
    })

    test('createRecipe (PUT Http 404)', () =>
    {
        return promiseForHttpError('PUT', 'createRecipe', 404)
    })

    test('createRecipe (DELETE Http 404)', () =>
    {
        return promiseForHttpError('DELETE', 'createRecipe', 404)
    })

    // deleteRecipe
    test('deleteRecipe (GET Http 404)', () =>
    {
        return promiseForHttpError('GET', 'deleteRecipe/invalid-id', 404)
    })

    test('deleteRecipe (POST Http 404)', () =>
    {
        return promiseForHttpError('POST', 'deleteRecipe/invalid-id', 404)
    })

    test('deleteRecipe (PUT Http 404)', () =>
    {
        return promiseForHttpError('PUT', 'deleteRecipe/invalid-id', 404)
    })

    test('deleteRecipe (DELETE Http 401)', () =>
    {
        return promiseForHttpError('DELETE', 'deleteRecipe/invalid-id', 401)
    })

    // updateRecipe
    test('updateRecipe (GET Http 404)', () =>
    {
        return promiseForHttpError('GET', 'updateRecipe', 404)
    })

    test('updateRecipe (POST Http 404)', () =>
    {
        return promiseForHttpError('POST', 'updateRecipe', 404)
    })

    test('updateRecipe (PUT Http 401)', () =>
    {
        return promiseForHttpError('PUT', 'updateRecipe', 401)
    })

    test('updateRecipe (DELETE Http 404)', () =>
    {
        return promiseForHttpError('DELETE', 'updateRecipe', 404)
    })
})

describe('Api Http code without authentication (users)', () =>
{
    // disconnect
    test('disconnect (GET Http 401)', () =>
    {
        return promiseForHttpError('GET', 'disconnect', 401)
    })

    test('disconnect (POST Http 404)', () =>
    {
        return promiseForHttpError('POST', 'disconnect', 404)
    })

    test('disconnect (PUT Http 404)', () =>
    {
        return promiseForHttpError('PUT', 'disconnect', 404)
    })

    test('disconnect (DELETE Http 404)', () =>
    {
        return promiseForHttpError('DELETE', 'disconnect', 404)
    })

    // connect
    test('connect (GET Http 401)', () =>
    {
        return promiseForHttpError('GET', 'connect', 401)
    })

    test('connect (POST Http 404)', () =>
    {
        return promiseForHttpError('POST', 'connect', 404)
    })

    test('connect (PUT Http 404)', () =>
    {
        return promiseForHttpError('PUT', 'connect', 404)
    })

    test('connect (DELETE Http 404)', () =>
    {
        return promiseForHttpError('DELETE', 'connect', 404)
    })
})

describe('User connection/disconnection', () =>
{
    test('Connection without login and password', () =>
    {
        return promiseForHttpError('GET', 'connect', 401)
    })

    test('Connection without login', () =>
    {
        return promiseForHttpError('GET', 'connect?password=' + g_valid_password, 401)
    })

    test('Connection without password', () =>
    {
        return promiseForHttpError('GET', 'connect?username=' + g_valid_username, 401)
    })

    test('Connection with valid login and password', () =>
    {
        return promiseForHttpSuccess('GET', 'connect?username=' + g_valid_username + '&password=' + g_valid_password, 200)
    })

    test('Disconnection when connected', () =>
    {
        return promiseForHttpSuccess('GET', 'disconnect', 200)
    })

    test('Disconnection when not connected', () =>
    {
        return promiseForHttpError('GET', 'disconnect', 401)
    })

    test('Connection with valid login and invalid password', () =>
    {
        return promiseForHttpError('GET', 'connect?username=' + g_valid_username + '&password=bad' + g_valid_password, 401)
    })

    test('Connection with invalid login and valid password', () =>
    {
        return promiseForHttpError('GET', 'connect?username=bad' + g_valid_username + '&password=' + g_valid_password, 401)
    })

    test('Connection with invalid login and invalid password', () =>
    {
        return promiseForHttpError('GET', 'connect?username=bad' + g_valid_username + '&password=bad' + g_valid_password, 401)
    })
})

// Local storage.
var g_food_id = ""
var g_food_entry = null

describe('Create, delete, update foods (connected user)', () =>
{
    test('Connection with valid login and password', () =>
    {
        return promiseForHttpSuccess('GET', 'connect?username=' + g_valid_username + '&password=' + g_valid_password, 200)
    })

    test('Create new food', () =>
    {
        return promiseForHttpSuccess('POST', 'createFood', 200, (resolve, reject, data) =>
        {
            if (data.id)
            {
                g_food_id = data.id
                resolve()
            }
            
            reject()
        })
    })

    test('Get new food data', () =>
    {
        return promiseForHttpSuccess('GET', 'getFoodData/' + g_food_id, 200, (resolve, reject, data) =>
        {
            g_food_entry = data
            
            if (!data.hasOwnProperty('id'))
                reject()

            if (data.id != g_food_id)
                reject()

            if (!data.hasOwnProperty('title'))
                reject()

            if (data.title != '')
                reject()

            if (!data.hasOwnProperty('details'))
                reject()

            if (data.details != '')
                reject()
            
            if (!data.hasOwnProperty('months'))
                reject()

            if (!Array.isArray(data.months))
                reject()

            if (!data.hasOwnProperty('supplyArea'))
                reject()

            if (typeof data.supplyArea != 'number')
                reject()

            if (!data.hasOwnProperty('cost'))
                reject()

            if (typeof data.cost != 'number')
                reject()

            if (!data.hasOwnProperty('environmentalImpact'))
                reject()

            if (!data.environmentalImpact.hasOwnProperty('co2eq'))
                reject()

            if (!data.environmentalImpact.co2eq.hasOwnProperty('kgco2e_kg'))
                reject()

            if (typeof data.environmentalImpact.co2eq.kgco2e_kg != "number")
                reject()

            if (!data.environmentalImpact.co2eq.hasOwnProperty('source'))
                reject()

            if (data.environmentalImpact.co2eq.source != '')
                reject()

            if (!data.hasOwnProperty('nutrition'))
                reject()

            let nutritionEntries = ['energy', 'proteins', 'carbohydrates', 'lipids', 'sugars', 'fibers', 'omega3_ala', 'omega3_epa',
                                    'omega3_dha', 'omega6_la', 'omega6_ara', 'omega9', 'salt', 'calcium', 'copper', 'iron', 'iodine', 
                                    'magnesium', 'sodium', 'zinc', 'vitamin_c', 'vitamin_d']

            for (let i in nutritionEntries)
            {
                let entry = nutritionEntries[i]
                if (!data.nutrition.hasOwnProperty(entry))
                    reject()

                if (!data.nutrition[entry].hasOwnProperty('value'))
                    reject()

                if (typeof data.nutrition[entry].value != "number")
                    reject()

                if (!data.nutrition[entry].hasOwnProperty('source'))
                    reject()

                if (data.nutrition[entry].source != '')
                    reject()
            }

            if (!data.hasOwnProperty('units'))
                reject()

            resolve()
        })
    })

    test('Update new food data', () =>
    {
        let d = g_food_entry

        d.title         = "New title"
        d.details       = "My details"
        d.months        = [1, 4, 9]
        d.supplyArea    = 2
        d.cost          = 12.3

        d.environmentalImpact.co2eq.kgco2e_kg = 0.789
        d.environmentalImpact.co2eq.source    = "ADEME"

        let nutritionEntries = ['energy', 'proteins', 'carbohydrates', 'lipids', 'sugars', 'fibers', 'omega3_ala', 'omega3_epa',
                                'omega3_dha', 'omega6_la', 'omega6_ara', 'omega9', 'salt', 'calcium', 'copper', 'iron', 'iodine', 
                                'magnesium', 'sodium', 'zinc', 'vitamin_c', 'vitamin_d']

        let value = 1.0

        for (let i in nutritionEntries)
        {
            let entry = nutritionEntries[i]

            d.nutrition[entry].value  = value
            d.nutrition[entry].source = entry + " source"

            value = value + 0.1
        }

        d.units = 
        {
            label: "liter",
            conversion: 1.123
        }

        return promiseForHttpSuccess('PUT', 'updateFood', 200, (resolve, reject, data) =>
        {
            if (data.title != "New title")
                reject()

            if (data.details != "My details")
                reject()

            if (data.months.length != 3)
                reject()

            if (!data.months.includes(1))
                reject()

            if (!data.months.includes(4))
                reject()

            if (!data.months.includes(9))
                reject()

            if (data.supplyArea != 2)
                reject()

            if (data.cost != 12.3)
                reject()

            if (data.environmentalImpact.co2eq.kgco2e_kg != 0.789)
                reject()

            if (data.environmentalImpact.co2eq.source != "ADEME")
                reject()

            if (data.units.conversion != 1.123)
                reject()

            if (data.units.label != "liter")
                reject()

            let nutritionEntries = ['energy', 'proteins', 'carbohydrates', 'lipids', 'sugars', 'fibers', 'omega3_ala', 'omega3_epa',
                                'omega3_dha', 'omega6_la', 'omega6_ara', 'omega9', 'salt', 'calcium', 'copper', 'iron', 'iodine', 
                                'magnesium', 'sodium', 'zinc', 'vitamin_c', 'vitamin_d']

            let value = 1.0

            for (let i in nutritionEntries)
            {
                let entry = nutritionEntries[i]

                if (data.nutrition[entry].value != value)
                    reject()
                
                if (data.nutrition[entry].source != entry + " source")
                    reject()

                value = value + 0.1
            }

            resolve()
        }, d)
    })

    test('Count for 1 food entry', () =>
    {
        return promiseForHttpSuccess('GET', 'getFoods', 200, (resolve, reject, data) => 
        {
            if (data.foods.length != 1)
                reject()

            if (data.foods[0].id != g_food_id)
                reject()

            if (data.foods[0].title != "New title")
                reject()

            if (data.foods[0].details != "My details")
                reject()
            
            resolve()
        })
    })

    test('Delete entry', () =>
    {
        return promiseForHttpSuccess('DELETE', 'deleteFood/' + g_food_id, 200)
    })

    test('Count food entries', () =>
    {
        return promiseForHttpSuccess('GET', 'getFoods', 200, (resolve, reject, data) => 
        {
            if (data.foods.length != 0)
                reject()

            resolve()
        })
    })
})

afterAll(() =>
{
    return new Promise((resolve, reject) =>
    {
        exec('docker stop "' + g_docker_name + '" && docker rm "' + g_docker_name + '"', (error, stdout, stderr) => 
        {
            if (error)
            {
                reject()
            }

            else
            {
                exec('pm2 del node', (error, stdout, stderr) => 
                {
                    if (error)
                    {
                        reject()
                    }

                    else
                    {
                        resolve()
                    }
                });
            }
        });
    })
});
