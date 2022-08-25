// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

// Load modules.
const dpf     = require('./src/data-providers/DataProviderFactory')
const config  = require('./src/config')
const express = require('express');

// Load methods.
const { installApi } = require('./src/api/Api');

// Load configuration.
const g_config = new config.Config();

// Create data provider.
const dataProviderType = g_config.providers.data.type
var   dataProvider     = dpf.createDataProvider(dataProviderType)
if (!dataProvider)
{
    console.error('Unknown data provider type: \'' + dataProviderType + '\'. Quit.')
    process.exit()
}
else
    console.log('Using data provider: \'' + dataProvider.description() + '\'')

// Connect to data provider.
if (!dataProvider.connect(g_config.providers.data.options))
{
    console.error('Cannot open data provider connection. Quit.')
    process.exit()
}

// Create application.
const g_app = express()
g_app.use(express.static('public'));

// Install Api.
installApi(g_app, dataProvider)

// Start server.
g_app.listen(g_config.server.port, () =>
{
    console.log('Starting API on port: ' + g_config.server.port)
})
