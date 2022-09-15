// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

var Parent = require('./AbstractEntryPoint')

/**
  * @api {delete} /deleteFood Delete a food entry
  * @apiDescription Delete a food entry into database.
  * @apiName deleteFood
  * @apiGroup Foods
  * @apiVersion 1.0.0
  */
class DeleteFood extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('deleteFood', true)
    }

    executeImplementation(req, res)
    {
        // Get food id.
        let id = req.params.id

        let promise = this.dataProvider.deleteFood(id)
        promise.then((data) =>
        {
            res.status(data.code)
            res.send(data.data)
        })
    }
}

module.exports.DeleteFood = DeleteFood
