// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

// The GetRecipeMetadata object implements the '/getRecipeMetadata' entry point that
// returns recipe minimal data.

var Parent = require('../AbstractEntryPoint')

/**
  * @api {get} /getRecipeMetadata/:id Get the recipe metadata (minimal data)
  * @apiDescription Get metadata for the recipe.
  * @apiName getRecipeMetadata
  * @apiGroup Recipes
  * @apiVersion 1.0.0
  * 
  * @apiParam {String} id Recipe identifier as uuid.
  *
  * @apiSuccess {Object[]} recipes Array of recipes.
  * @apiSuccess {String} recipes.id Recipe identifier as guid.
  * @apiSuccess {String} recipes.group Recipe group identifier.
  * @apiSuccess {String} recipes.details Recipe details (subtitle).
  * @apiSuccess {Number} recipes.type Recipe type: 0 - undefined, 1 - aperitif, 2 - starter, 4 - dish, 8 - dessert.
  * @apiSuccess {Number} recipes.temperature Temperature of service: 0 - indifferent, 1 - cold, 2 - hot.
  * @apiSuccess {Object} recipes.exclusions Exclusions objet. Define boolean attributes set to true if the recipe 
  *                      doesn't contain such type of food. Attributes: meat, fish, dairy, eggs, oap (other animal products).
  * @apiSuccess {Number[]} recipes.months Array containing months for foods supply.
  * @apiSuccess {Number} recipes.nbOfParts Number of parts for the recipe.
  * @apiSuccess {Number} recipes.weight Total weight (in kg) for the final product.
  * @apiSuccess {Object} recipes.times Object containing times in minutes (as Number): preparation, cooking, rest.
  * @apiSuccess {Object} recipes.resources Object containing resources used for this recipe.
  * @apiSuccess {Object} recipes.resources.energy Object containing energy used for this recipe (Number attributes, in kWh): oven, hob.
  * @apiSuccess {Object} recipes.resources.water Object containing water used for this recipe (Number in liters).
  * @apiSuccess {Number} recipes.ingredientsCost Total cost (in €) for ingredients.
  * @apiSuccess {Object} recipes.environmentalImpact Object containing environmental impact for this recipe.
  * @apiSuccess {Number} recipes.environmentalImpact.ingredientsCo2eq CO2 emissions for ingredients only (excluding energy) in kgCO2eq.
  * 
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *       "recipes":
  *       [
  *           {
  *               "id": "1",
  *               "group": "u4ag84d",
  *               "details": "végétarienne",
  *               "type": 4,
  *               "temperature": 2,
  *               "exclusions":
  *               {
  *                   "meat": true,
  *                   "fish": true,
  *                   "dairy": false,
  *                   "eggs": true,
  *                   "oap": false
  *               },
  *               "months": [3, 4, 5],
  *               "nbOfParts": 6,
  *               "weight": 0.9,
  *               "times":
  *               {
  *                   "preparation": 25,
  *                   "cooking": 45,
  *                   "rest": 0
  *               },
  *               "resources":
  *               {
  *                   "energy":
  *                   {
  *                       "oven": 0.8,
  *                       "hob": 0.0
  *                   },
  *                   "water": 2.5
  *               }
  *               "ingredientsCost": 4.35,
  *               "environmentalImpact":
  *               {
  *                   "ingredientsCo2eq": 0.65
  *               }
  *           }
  *       ]
  *     }
  */
class GetRecipeMetadata extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('getRecipeMetadata', false)
    }

    executeImplementation(req, res)
    {
        let id = req.params.id
        
        let promise = this.dataProvider.getRecipeMetadata(id)
        promise.then(data => 
        {
            res.status(data.code)
            res.send(data.data)
        })
    }
}

module.exports.GetRecipeMetadata = GetRecipeMetadata
