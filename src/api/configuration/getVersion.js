// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

var Parent = require('../AbstractEntryPoint')

/**
  * @api {get} /getVersion Get version for the current Api
  * @apiDescription Get version for the current Api
  * @apiName getVersion
  * @apiGroup Configuration
  * @apiVersion 1.0.0
  * @apiPrivate
  */
class GetVersion extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('getVersion', false)
    }

    executeImplementation(req, res)
    {
        let promise = this.dataProvider.getVersion()
        promise.then(data =>
        {
            res.status(data.code)
            res.send(data.data)
        })
    }
}

module.exports.GetVersion = GetVersion
