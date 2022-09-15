// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

var Parent = require('./AbstractEntryPoint')

/**
  * @api {post} /dump Dump all database entries
  * @apiDescription Create a dump for database entries (JSON format).
  * @apiName dump
  * @apiGroup Tools
  * @apiVersion 1.0.0
  * @apiPrivate
  *
  * @apiSuccess {Object} foods Object containing all database objects.
  */
class Dump extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('dump', true)
    }

    executeImplementation(req, res)
    {
        let promise = this.dataProvider.dump()
        promise.then(data =>
        {
            res.status(data.code)
            res.send(data.data)
        })
    }
}

module.exports.Dump = Dump
