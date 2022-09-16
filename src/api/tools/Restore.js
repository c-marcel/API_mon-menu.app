// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

var Parent = require('../AbstractEntryPoint')

/**
  * @api {post} /restore Restore all database entries
  * @apiDescription Import a dump for database entries (JSON format).
  * @apiName restore
  * @apiGroup Tools
  * @apiVersion 1.0.0
  * @apiPrivate
  */
class Restore extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('restore', true)
    }

    executeImplementation(req, res)
    {
        let promise = this.dataProvider.restore(req.body)
        promise.then(data =>
        {
            res.status(data.code)
            res.send(data.data)
        })
    }
}

module.exports.Restore = Restore
