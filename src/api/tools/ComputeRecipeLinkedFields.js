// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

var Parent = require('../AbstractEntryPoint')

/**
  * @api {post} /computeRecipeLinkedFields Compute all linked fields for recipes.
  * @apiDescription Compute recipe linked fields (months, ingredientsCost, environmentalImpact)
  * @apiName computeRecipeLinkedFields
  * @apiGroup Tools
  * @apiVersion 1.0.0
  * @apiPrivate
  *
  * @apiSuccess {Number} foodNumber Number of foods into database.
  * @apiSuccess {Number} recipeNumber Number of recipes into database.
  * @apiSuccess {Number} timeOfProcessing Number of milliseconds for processing linked fields.
  * @apiSuccess {Array} updatedRecipes Array containing id for updated recipes.
  */
class ComputeRecipeLinkedFields extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('computeRecipeLinkedFields', true)
    }

    executeImplementation(req, res)
    {
        let promise = this.dataProvider.computeRecipeLinkedFields()
        promise.then(data =>
        {
            res.status(data.code)
            res.send(data.data)
        })
    }
}

module.exports.ComputeRecipeLinkedFields = ComputeRecipeLinkedFields
