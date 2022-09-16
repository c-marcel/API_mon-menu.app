// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

// Data restore local filename.
const inputFilename = "./data.sjson"

// Load modules.
const dpf    = require('../src/data-providers/DataProviderFactory')
const config = require('../src/config')
const fs     = require('fs');

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

let sdata = fs.readFileSync(inputFilename, 'utf-8')
let data = JSON.parse(sdata)

dataProvider.restore(data).then(d =>
{
    if (d.code != 200)
    {
        console.error("Cannot dump data from data provider.")
        process.exit()
    }

    console.log("Done.")
})
