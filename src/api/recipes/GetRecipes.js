// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

// The GetRecipes object implements the '/getRecipes' entry point that
// returns all recipe ids for provided group.

var Parent = require('../AbstractEntryPoint')

/**
  * @api {get} /getRecipes Get recipe ids for provided group
  * @apiDescription Get recipe ids for provided group.
  * @apiName getRecipes
  * @apiGroup Recipes
  * @apiVersion 1.0.0
  * 
  * @apiQuery {String} group Recipe group identifier as uuid.
  *
  * @apiSuccess {String[]} recipes Array of recipe ids.
  * 
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *       "recipes": 
  *       [
  *          "id-1",
  *          "id-2"
  *       ]
  *     }
  */
class GetRecipes extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('getRecipes', false)
    }

    executeImplementation(req, res)
    {
        let group = req.query.group
        
        let promise = this.dataProvider.getRecipes(group)
        promise.then(data => 
        {
            res.status(data.code)
            res.send(data.data)
        })
    }
}

module.exports.GetRecipes = GetRecipes
