// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

var Parent = require('../AbstractEntryPoint')

/**
  * @api {post} /createRecipeGroup Create a new recipe group
  * @apiDescription Create a new empty recipe group into database and return entry id.
  * @apiName createRecipeGroup
  * @apiGroup RecipeGroups
  * @apiVersion 1.0.0
  * @apiPrivate
  *
  * @apiSuccess {String} id Recipe group identifier as guid.
  * 
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *         "id": "126"
  *     }
  */
class CreateRecipeGroup extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('createRecipeGroup', true)
    }

    executeImplementation(req, res)
    {
        let promise = this.dataProvider.createRecipeGroup()
        promise.then(data =>
        {
            res.status(data.code)
            res.send(data.data)
        })
    }
}

module.exports.CreateRecipeGroup = CreateRecipeGroup
