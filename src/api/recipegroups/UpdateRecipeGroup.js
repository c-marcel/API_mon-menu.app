// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

var Parent = require('../AbstractEntryPoint')

/**
  * @api {put} /updateRecipeGroup Update a recipe group
  * @apiDescription Update a recipe group into database. Entry content must be provided into request body as JSON object.
  * Stored entry will be returned into answer body as JSON object.
  * @apiName updateRecipeGroup
  * @apiGroup RecipeGroups
  * @apiVersion 1.0.0
  */
class UpdateRecipeGroup extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('updateRecipeGroup', true)
    }

    executeImplementation(req, res)
    {
        let promise = this.dataProvider.updateRecipeGroup(req.body)
        promise.then(data =>
        {
            res.status(data.code)
            res.send(data.data)
        })
    }
}

module.exports.UpdateRecipeGroup = UpdateRecipeGroup
