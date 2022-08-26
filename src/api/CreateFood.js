// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

var Parent = require('./AbstractEntryPoint')

/**
  * @api {post} /createFood Create a new food entry
  * @apiDescription Create a new empty food entry into database and return entry id.
  * @apiName createFood
  * @apiGroup Foods
  * @apiVersion 1.0.0
  *
  * @apiSuccess {Number} id Food identifier as number.
  * 
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *         "id": 126
  *     }
  */
class CreateFood extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('createFood')
    }

    executeImplementation(req, res)
    {
        let promise = this.dataProvider.createFood()
        promise.then(data =>
        {
            res.status(data.code)
            res.send(data.data)
        })
    }
}

module.exports.CreateFood = CreateFood
