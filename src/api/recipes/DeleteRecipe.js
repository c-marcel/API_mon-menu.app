// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

var Parent = require('../AbstractEntryPoint')

/**
  * @api {delete} /deleteRecipe/:id Delete a recipe
  * @apiDescription Delete a recipe into database.
  * @apiName deleteRecipe
  * @apiGroup Recipes
  * @apiVersion 1.0.0
  * 
  * @apiParam {String} id Recette identifier as uuid.
  */
class DeleteRecipe extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('deleteRecipe', true)
    }

    executeImplementation(req, res)
    {
        let id = req.params.id

        let promise = this.dataProvider.deleteRecipe(id)
        promise.then((data) =>
        {
            res.status(data.code)
            res.send(data.data)
        })
    }
}

module.exports.DeleteRecipe = DeleteRecipe
