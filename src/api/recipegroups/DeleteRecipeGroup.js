// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

var Parent = require('../AbstractEntryPoint')

/**
  * @api {delete} /deleteRecipeGroup/:id Delete a recipe group
  * @apiDescription Delete a recipe group into database.
  * @apiName deleteRecipeGroup
  * @apiGroup RecipeGroups
  * @apiVersion 1.0.0
  * 
  * @apiParam {String} id Group identifier as uuid.
  */
class DeleteRecipeGroup extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('deleteRecipeGroup', true)
    }

    executeImplementation(req, res)
    {
        // Get food id.
        let id = req.params.id

        let promise = this.dataProvider.deleteRecipeGroup(id)
        promise.then((data) =>
        {
            res.status(data.code)
            res.send(data.data)
        })
    }
}

module.exports.DeleteRecipeGroup = DeleteRecipeGroup
