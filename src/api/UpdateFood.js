// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

var Parent = require('./AbstractEntryPoint')

/**
  * @api {put} /updateFood Update a food entry
  * @apiDescription Update a food entry into database. Entry content must be provided into request body as JSON object.
  * Stored entry will be returned into answer body as JSON object.
  * @apiName updateFood
  * @apiHeader {String} auth-token Authentication token (private Api).
  * @apiGroup Foods
  * @apiVersion 1.0.0
  */
class UpdateFood extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('updateFood', true)
    }

    executeImplementation(req, res)
    {
        let promise = this.dataProvider.updateFood(req.body)
        promise.then(data =>
        {
            res.status(data.code)
            res.send(data.data)
        })
    }
}

module.exports.UpdateFood = UpdateFood
