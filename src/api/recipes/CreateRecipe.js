// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

var Parent = require('../AbstractEntryPoint')

/**
  * @api {post} /createRecipe Create a new recipe
  * @apiDescription Create a new empty recipe into database and return entry id.
  * @apiName createRecipe
  * @apiGroup Recipes
  * @apiVersion 1.0.0
  * @apiPrivate
  *
  * @apiSuccess {String} id Recipe identifier as guid.
  * 
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *         "id": "126"
  *     }
  */
class CreateRecipe extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('createRecipe', true)
    }

    executeImplementation(req, res)
    {
        let promise = this.dataProvider.createRecipe()
        promise.then(data =>
        {
            res.status(data.code)
            res.send(data.data)
        })
    }
}

module.exports.CreateRecipe = CreateRecipe
