// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

// The GetRecipeData object implements the '/getRecipeData' entry point that
// returns recipe all data.

var Parent = require('../AbstractEntryPoint')

/**
  * @api {get} /getRecipeData/:id Get the recipe data
  * @apiDescription Get data for the recipe.
  * @apiName getRecipeData
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
  * @apiSuccess {String[]} recipes.contains Array of strings computed with the 'contains' fields of foods.
  * @apiSuccess {Number[]} recipes.months Array containing months for foods supply.
  * @apiSuccess {String[]} recipes.tags Array containing hashtags.
  * @apiSuccess {Number} recipes.nbOfParts Number of parts for the recipe.
  * @apiSuccess {Number} recipes.weight Total weight (in kg) for the final product.
  * @apiSuccess {String} recipes.picture Picture filename relative to images path.
  * @apiSuccess {String} recipes.recipe Recipe content as HTML content.
  * @apiSuccess {Object[]} recipes.ingredients Array of objects containing all the ingredients.
  * @apiSuccess {String} recipes.ingredients.food Food identifier if ingredient is a food.
  * @apiSuccess {String} recipes.ingredients.recipe Recipe identifier if ingredient is a recipe.
  * @apiSuccess {Number} recipes.ingredients.quantity Ingredient quantity in kg.
  * @apiSuccess {Number} recipes.ingredients.remainingQuantity Ingredient remaining quantity in kg if any (optional). In case of reused ingredient (e.g. oil).
  * @apiSuccess {Boolean} recipes.ingredients.raw Set to true if ingredient or recipe is used without cooking (for nutrients conservation).
  * @apiSuccess {Object} recipes.times Object containing times in minutes (as Number): preparation, cooking, rest.
  * @apiSuccess {Object} recipes.resources Object containing resources used for this recipe.
  * @apiSuccess {Object} recipes.resources.energy Object containing energy used for this recipe (Number attributes, in kWh): oven, hob.
  * @apiSuccess {Object} recipes.resources.water Object containing water used for this recipe (Number in liters).
  * @apiSuccess {Number} recipes.ingredientsCost Total cost (in €) for ingredients.
  * @apiSuccess {Object} recipes.environmentalImpact Object containing environmental impact fot this recipe.
  * @apiSuccess {Number} recipes.environmentalImpact.ingredientsCo2eq CO2 emissions for ingredients only (excluding energy) in kgCO2eq.
  * @apiSuccess {Object} recipes.waste Object containing waste for this recipe.
  * @apiSuccess {Number} recipes.waste.water Waste water in liters.
  * @apiSuccess {Number} recipes.waste.nonRecyclable Non recyclable waste in kg.
  * @apiSuccess {Object} recipes.waste.recyclable Object containing recyclable wastes.
  * @apiSuccess {Object} recipes.waste.recyclable.ingredients Object containing waste that can be used into other recipes.
  * @apiSuccess {Number} recipes.waste.recyclable.ingredients.FOOD_ID Quantity in kg for the FOOD_ID ingredient (e.g. : "p4a9d54": 0.25).
  * @apiSuccess {Number} recipes.waste.recyclable.biodegradable Biodegradable wastes in kg.
  * @apiSuccess {Number} recipes.waste.recyclable.plastics Plastic wastes in kg.
  * @apiSuccess {Number} recipes.waste.recyclable.bricks Brick wastes in kg.
  * @apiSuccess {Number} recipes.waste.recyclable.papers Paper wastes in kg.
  * @apiSuccess {Number} recipes.waste.recyclable.glasses Glass wastes in kg.
  * @apiSuccess {Number} recipes.waste.recyclable.others Other wastes in kg.
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
  *               "contains": ["meat", "eggs"],
  *               "months": [3, 4, 5],
  *               "tags": ['verygood'],
  *               "nbOfParts": 6,
  *               "weight": 0.9,
  *               "picture": "recipe-1.png",
  *               "recipe": "<html>...</html>",
  *               "ingredients":
  *               [
  *                   {
  *                       "food": "5",
  *                       "quantity": 0.4,
  *                       "remainingQuantity": 0.1
  *                   },
  *                   {
  *                       "food": "17",
  *                       "quantity": 0.25,
  *                       "raw": true
  *                   },
  *                   {
  *                       "recipe": "126",
  *                       "quantity": 0.15
  *                   }
  *               ],
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
  *               },
  *               "waste":
  *               {
  *                   "water": 2.3,
  *                   "recyclable":
  *                   {
  *                       "ingredients":
  *                       {
  *                           "hgf51": 0.3
  *                       },
  *                       "biodegradable": 0.17,
  *                       "plastics": 0.05,
  *                       "bricks": 0.12,
  *                       "papers": 0.0,
  *                       "glasses": 0.0,
  *                       "others": 0.1
  *                   },
  *                   "nonRecyclable": 0.08
  *               }
  *           }
  *       ]
  *     }
  */
class GetRecipeData extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('getRecipeData', false)
    }

    executeImplementation(req, res)
    {
        let id = req.params.id
        
        let promise = this.dataProvider.getRecipeData(id)
        promise.then(data => 
        {
            res.status(data.code)
            res.send(data.data)
        })
    }
}

module.exports.GetRecipeData = GetRecipeData
