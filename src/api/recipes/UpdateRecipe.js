// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

var Parent = require('../AbstractEntryPoint')

/**
  * @api {put} /updateRecipe Update a recipe
  * @apiDescription Update a recipe into database. Entry content must be provided into request body as JSON object.
  * Stored entry will be returned into answer body as JSON object.
  * @apiName updateRecipe
  * @apiGroup Recipes
  * @apiVersion 1.0.0
  */
class UpdateRecipe extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('updateRecipe', true)
    }

    executeImplementation(req, res)
    {
        let promise = this.dataProvider.updateRecipe(req.body)
        promise.then(data =>
        {
            res.status(data.code)
            res.send(data.data)
        })
    }
}

module.exports.UpdateRecipe = UpdateRecipe
