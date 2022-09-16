// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

// The GetRecipeGroupData object implements the '/getRecipeGroupData/:id' entry point that
// returns all data for a specific recipe group. Group is identified with the
// :id parameter that is compared with the id field into database objects.

var Parent = require('../AbstractEntryPoint')

/**
  * @api {get} /getRecipeGroupData/:id Get the data for a specific recipe group
  * @apiDescription Get all available data for a specific recipe group.
  * @apiName getRecipeGroupData
  * @apiGroup RecipeGroups
  * @apiVersion 1.0.0
  * 
  * @apiParam {String} id Group identifier as uuid.
  *
  * @apiSuccess {Object} recipeGroud Object containing group data.
  * @apiSuccess {String} recipeGroud.id Recipe group identifier as string.
  * @apiSuccess {String} recipeGroud.title Recipe group title.
  * 
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *         "id":                     "1",
  *         "title":                  'Recette numéro 1'
  *     }
  */
class GetRecipeGroupData extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('getRecipeGroupData', false)
    }

    executeImplementation(req, res)
    {
        // Get food id.
        let id = req.params.id

        let promise = this.dataProvider.getRecipeGroupData(id)
        promise.then((data) =>
        {
            res.status(data.code)
            res.send(data.data)
        })
    }
}

module.exports.GetRecipeGroupData = GetRecipeGroupData
