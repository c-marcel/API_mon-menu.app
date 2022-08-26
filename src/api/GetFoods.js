// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

// The GetFoods object implements the '/getFoods' entry point that
// returns all foods into database (fields: id, title, details).

var Parent = require('./AbstractEntryPoint')

/**
  * @api {get} /getFoods Get the list of the foods
  * @apiDescription Get the list of all available foods into database. This entry point doesn't provide
  * the whole fields of database but only these fields: id, title, details.
  * @apiName getFoods
  * @apiGroup Foods
  * @apiVersion 1.0.0
  *
  * @apiSuccess {Object[]} foods Array of foods.
  * @apiSuccess {Number} foods.id Food identifier as number.
  * @apiSuccess {String} foods.title Food title.
  * @apiSuccess {String} foods.details Food details.
  * 
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *       "foods":
  *       [
  *           {
  *               "id": 1,
  *               "title": "Noisettes",
  *               "details": "entières, décortiquées, bio, en vrac'"
  *           }
  *       ]
  *     }
  */
class GetFoods extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('getFoods')
    }

    executeImplementation(req, res)
    {
        let promise = this.dataProvider.getFoods()
        promise.then(data => 
        {
            res.status(data.code)
            res.send(data.data)
        })
    }
}

module.exports.GetFoods = GetFoods
