// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

// Load modules.
const dpf     = require('./src/data-providers/DataProviderFactory')
const umf     = require('./src/user-managers/UserManagerFactory')
const sqlite  = require('better-sqlite3')
const session = require('express-session')
const config  = require('./src/config')
const express = require('express');

// Load methods.
const { installApi } = require('./src/api/Api');

// Load configuration.
const g_config = new config.Config();

// Create data provider.
var dataProvider = dpf.createDataProvider(g_config.provider.type)
if (!dataProvider)
{
    console.error('Unknown data provider type: \'' + g_config.provider.type + '\'. Quit.')
    process.exit()
}
else
    console.log('Using data provider: \'' + dataProvider.description() + '\'')

// Connect to data provider.
if (!dataProvider.connect(g_config.provider.options))
{
    console.error('Cannot open data provider connection. Quit.')
    process.exit()
}

// Create user manager.
var userManager = umf.createUserManager(g_config.provider.type)
if (!userManager)
{
    console.error('Unknown user manager type: \'' + g_config.provider.type + '\'. Quit.')
    process.exit()
}
else
    console.log('Using user manager: \'' + userManager.description() + '\'')

// Connect to user manager.
if (!userManager.connect(g_config.provider.options))
{
    console.error('Cannot open user manager connection. Quit.')
    process.exit()
}

// Create user sessions storage.
const SqliteStore         = require("better-sqlite3-session-store")(session)
const userSessionsDatabse = new sqlite("userSessions.sqlite3");
const sessionStore        = new SqliteStore({ client: userSessionsDatabse })

// Create application.
const g_app = express()

g_app.use(express.static('public'));
g_app.use(express.json());
g_app.use(session(
{
    store:              sessionStore,
    secret:             g_config.server.cookies.secret,
    saveUninitialized:  g_config.server.cookies.saveUninitialized
}))

g_app.disable('x-powered-by');

// Catch invalid JSON body.
g_app.use((err, req, res, next) =>
{
    if (err.status == 400 && err.type == 'entity.parse.failed')
    {
        res.status(err.status)
        res.send(JSON.parse('{"error": "Invalid JSON", "details": "Cannot parse body as JSON object"}'))
        
        return
    }

    next();
})

// Install Api.
installApi(g_app, dataProvider, userManager)

// Start server.
// Note: there is no need to use TLS because this server will communicate
// locally with the Apache proxy.
g_app.listen(g_config.server.port, () =>
{
    console.log('Starting API on port: ' + g_config.server.port)
})
