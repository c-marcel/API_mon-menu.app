// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

// The GetRecipeGroups object implements the '/getRecipeGroups' entry point that
// returns all recipe groups into database (fields: id, title).

var Parent = require('../AbstractEntryPoint')

/**
  * @api {get} /getRecipeGroups Get the list of the recipe groups
  * @apiDescription Get the list of all available recipe groups into database.
  * @apiName getRecipeGroups
  * @apiGroup RecipeGroups
  * @apiVersion 1.0.0
  *
  * @apiSuccess {Object[]} recipeGroups Array of recipe groups.
  * @apiSuccess {String} recipeGroups.id Recipe group identifier as guid.
  * @apiSuccess {String} recipeGroups.title Recipe group title.
  * 
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *       "recipeGroups":
  *       [
  *           {
  *               "id": "1",
  *               "title": "Recette 1",
  *           }
  *       ]
  *     }
  */
class GetRecipeGroups extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('getRecipeGroups', false)
    }

    executeImplementation(req, res)
    {
        let promise = this.dataProvider.getRecipeGroups()
        promise.then(data => 
        {
            res.status(data.code)
            res.send(data.data)
        })
    }
}

module.exports.GetRecipeGroups = GetRecipeGroups
