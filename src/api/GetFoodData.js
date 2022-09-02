// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

// The GetFoodData object implements the '/getFoodData/:id' entry point that
// returns all data for a specific food entry. Food is identified with the
// :id parameter that is compared with the id field into database objects.

var Parent = require('./AbstractEntryPoint')

/**
  * @api {get} /getFoodData/:id Get the data for a specific food
  * @apiDescription Get all available data for a specific food.
  * @apiName getFoodData
  * @apiGroup Foods
  * @apiVersion 1.0.0
  * 
  * @apiParam {Number} id Food identifier as integer.
  *
  * @apiSuccess {Object} food Object containing food data.
  * @apiSuccess {Number} food.id Food identifier as number.
  * @apiSuccess {String} food.title Food title.
  * @apiSuccess {String} food.details Food subtitle.
  * @apiSuccess {Array} food.months Array containing months when food is available (1: January, ...).
  * @apiSuccess {Number} food.supplyArea Enumeration for supply area (0: not defined, 1: local, 2: national, 4: continental, 8: global). 
  * @apiSuccess {Number} food.cost Cost in euro per kilogram.
  * @apiSuccess {Object} food.environmentalImpact Object containing environmental impact.
  * @apiSuccess {Object} food.environmentalImpact.co2eq Object containing CO2 impact.
  * @apiSuccess {Number} food.environmentalImpact.co2eq.kgco2e_kg Equivalent C02 in kg per kg of food.
  * @apiSuccess {String} food.environmentalImpact.co2eq.source Source of the data.
  * @apiSuccess {Object} food.nutrition Object containing nutrition data.
  * @apiSuccess {Object} food.nutrition.energy Object containing energy data (value: in kcal per kg, source: source of the data).
  * @apiSuccess {Object} food.nutrition.proteins Object containing proteins data (value: in kg per kg, source: source of the data).
  * @apiSuccess {Object} food.nutrition.carbohydrates Object containing carbohydrates data (value: in kg per kg, source: source of the data).
  * @apiSuccess {Object} food.nutrition.lipids Object containing lipids data (value: in kg per kg, source: source of the data).
  * @apiSuccess {Object} food.nutrition.sugars Object containing sugars data (value: in kg per kg, source: source of the data).
  * @apiSuccess {Object} food.nutrition.fibers Object containing fibers data (value: in kg per kg, source: source of the data).
  * @apiSuccess {Object} food.nutrition.omega3_ala Object containing omega-3 ALA data (value: in kg per kg, source: source of the data).
  * @apiSuccess {Object} food.nutrition.omega3_epa Object containing omega-3 EPA data (value: in kg per kg, source: source of the data).
  * @apiSuccess {Object} food.nutrition.omega3_dha Object containing omega-3 DHA data (value: in kg per kg, source: source of the data).
  * @apiSuccess {Object} food.nutrition.omega6_la Object containing omega-6 LA data (value: in kg per kg, source: source of the data).
  * @apiSuccess {Object} food.nutrition.omega6_ara Object containing omega-6 ARA data (value: in kg per kg, source: source of the data).
  * @apiSuccess {Object} food.nutrition.omega9 Object containing omega-9 data (value: in kg per kg, source: source of the data).
  * @apiSuccess {Object} food.nutrition.salt Object containing salt data (value: in kg per kg, source: source of the data).
  * @apiSuccess {Object} food.nutrition.calcium Object containing calcium data (value: in kg per kg, source: source of the data).
  * @apiSuccess {Object} food.nutrition.copper Object containing copper data (value: in kg per kg, source: source of the data).
  * @apiSuccess {Object} food.nutrition.iron Object containing iron data (value: in kg per kg, source: source of the data).
  * @apiSuccess {Object} food.nutrition.iodine Object containing iodine data (value: in kg per kg, source: source of the data).
  * @apiSuccess {Object} food.nutrition.magnesium Object containing magnesium data (value: in kg per kg, source: source of the data).
  * @apiSuccess {Object} food.nutrition.sodium Object containing sodium data (value: in kg per kg, source: source of the data).
  * @apiSuccess {Object} food.nutrition.zinc Object containing zinc data (value: in kg per kg, source: source of the data).
  * @apiSuccess {Object} food.nutrition.vitamin_c Object containing C vitamin data (value: in kg per kg, source: source of the data).
  * @apiSuccess {Object} food.nutrition.vitamin_d Object containing D vitamin data (value: in kg per kg, source: source of the data).
  * 
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *         "id":                     1,
  *         "title":                  'Noisettes',
  *         "details":                'entières, décortiquées, bio, en vrac',
  *         "months":                 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  *         "supplyArea":             1,
  *         "cost":                   19.3,
  *         "environmentalImpact":
  *         {
  *             "co2eq":
  *             {
  *                 "kgco2e_kg":      0.52,
  *                 "source":         'doi:10.3390/su71114917'
  *             }
  *         },
  *         "nutrition":
  *         {
  *             "energy":
  *             {
  *                 "value":          6280.0,
  *                 "source":         'https://www.infocalories.fr/calories/calories-noisettes.php'
  *             },
  *             "proteins":
  *             {
  *                 "value":          0.144,
  *                 "source":         'Ciqual'
  *             },
  *             "carbohydrates":
  *             {
  *                 "value":          0.0716,
  *                 "source":         'Ciqual'
  *             },
  *             "lipids":
  *             {
  *                 "value":          0.569,
  *                 "source":         'Ciqual'
  *             },
  *             "sugars":
  *             {
  *                 "value":          0.049,
  *                 "source":         'Ciqual'
  *             },
  *             "fibers":
  *             {
  *                 "value":          0.116,
  *                 "source":         'Ciqual'
  *             },
  *             "omega3_ala":
  *             {
  *                 "value":          0.0005,
  *                 "source":         'Ciqual'
  *             },
  *             "omega3_epa":
  *             {
  *                 "value":          0.0,
  *                 "source":         'Ciqual'
  *             },
  *             "omega3_dha":
  *             {
  *                 "value":          0.0,
  *                 "source":         'Ciqual'
  *             },
  *             "omega6_la":
  *             {
  *                 "value":          0.0535,
  *                 "source":         'Ciqual'
  *             },
  *             "omega6_ara":
  *             {
  *                 "value":          0.0,
  *                 "source":         'Ciqual'
  *             },
  *             "omega9":
  *             {
  *                 "value":          0.434,
  *                 "source":         'Ciqual'
  *             },
  *             "salt":
  *             {
  *                 "value":          0.00013,
  *                 "source":         'Ciqual'
  *             },
  *             "calcium":
  *             {
  *                 "value":          1.20e-3,
  *                 "source":         'Ciqual'
  *             },
  *             "copper":
  *             {
  *                 "value":          1.7e-5,
  *                 "source":         'Ciqual'
  *             },
  *             "iron":
  *             {
  *                 "value":          3e-5,
  *                 "source":         'Ciqual'
  *             },
  *             "iodine":
  *             {
  *                 "value":          2e-7,
  *                 "source":         'Ciqual'
  *             },
  *             "magnesium":
  *             {
  *                 "value":          1.60e-3,
  *                 "source":         'Ciqual'
  *             },
  *             "sodium":
  *             {
  *                 "value":          5e-5,
  *                 "source":         'Ciqual'
  *             },
  *             "zinc":
  *             {
  *                 "value":          2.3e-5,
  *                 "source":         'Ciqual'
  *             },
  *             "vitamin_c":
  *             {
  *                 "value":          0.5e-5,
  *                 "source":         'Ciqual'
  *             },
  *             "vitamin_d":
  *             {
  *                 "value":          0.25e-8,
  *                 "source":         'Ciqual'
  *             }
  *         }
  *     }
  */
class GetFoodData extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('getFoodData', false)
    }

    executeImplementation(req, res)
    {
        // Get food id.
        let id = req.params.id

        let promise = this.dataProvider.getFoodData(id)
        promise.then((data) =>
        {
            res.status(data.code)
            res.send(data.data)
        })
    }
}

module.exports.GetFoodData = GetFoodData
