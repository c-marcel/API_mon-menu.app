// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

// This data provider ('debug') is a local and volatile database
// for debug purpose only.

var Parent = require('./AbstractDataProvider')

// gDebugDataProviderData object stores some data for debug purposes.
var gDebugDataProviderData =
{
    foods:
    [
        {
            id:                     1,
            title:                  'Noisettes',
            details:                'entières, décortiquées, bio, en vrac',
            months:                 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            supplyArea:             1,
            cost:                   19.3,
            environmentalImpact:
            {
                co2eq:
                {
                    kgco2e_kg:      0.52,
                    source:         'doi:10.3390/su71114917'
                }
            },
            nutrition:
            {
                energy:
                {
                    value:          6280.0,
                    source:         'https://www.infocalories.fr/calories/calories-noisettes.php'
                },
                proteins:
                {
                    value:          0.144,
                    source:         'Ciqual'
                },
                carbohydrates:
                {
                    value:          0.0716,
                    source:         'Ciqual'
                },
                lipids:
                {
                    value:          0.569,
                    source:         'Ciqual'
                },
                sugars:
                {
                    value:          0.049,
                    source:         'Ciqual'
                },
                fibers:
                {
                    value:          0.116,
                    source:         'Ciqual'
                },
                omega3_ala:
                {
                    value:          0.0005,
                    source:         'Ciqual'
                },
                omega3_epa:
                {
                    value:          0.0,
                    source:         'Ciqual'
                },
                omega3_dha:
                {
                    value:          0.0,
                    source:         'Ciqual'
                },
                omega6_la:
                {
                    value:          0.0535,
                    source:         'Ciqual'
                },
                omega6_ara:
                {
                    value:          0.0,
                    source:         'Ciqual'
                },
                omega9:
                {
                    value:          0.434,
                    source:         'Ciqual'
                },
                salt:
                {
                    value:          0.00013,
                    source:         'Ciqual'
                },
                calcium:
                {
                    value:          1.20e-3,
                    source:         'Ciqual'
                },
                copper:
                {
                    value:          1.7e-5,
                    source:         'Ciqual'
                },
                iron:
                {
                    value:          3e-5,
                    source:         'Ciqual'
                },
                iodine:
                {
                    value:          2e-7,
                    source:         'Ciqual'
                },
                magnesium:
                {
                    value:          1.60e-3,
                    source:         'Ciqual'
                },
                sodium:
                {
                    value:          5e-5,
                    source:         'Ciqual'
                },
                zinc:
                {
                    value:          2.3e-5,
                    source:         'Ciqual'
                },
                vitamin_c:
                {
                    value:          0.5e-5,
                    source:         'Ciqual'
                },
                vitamin_d:
                {
                    value:          0.25e-8,
                    source:         'Ciqual'
                }
            }
        },
        {
            id:                     2,
            title:                  'Flocons d\'avoine',
            details:                'petits, bio, en vrac',
            months:                 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            supplyArea:             1,
            cost:                   2.5,
            environmentalImpact:
            {
                co2eq:
                {
                    kgco2e_kg:      0.361,
                    source:         'https://www.nu3.fr/blogs/nutrition/empreinte-carbone-alimentaire'
                }
            },
            nutrition:
            {
                energy:
                {
                    value:          3670.0,
                    source:         'Ciqual'
                },
                proteins:
                {
                    value:          0.133,
                    source:         'Ciqual'
                },
                carbohydrates:
                {
                    value:          0.579,
                    source:         'Ciqual'
                },
                lipids:
                {
                    value:          0.0651,
                    source:         'Ciqual'
                },
                sugars:
                {
                    value:          0.0097,
                    source:         'Ciqual'
                },
                fibers:
                {
                    value:          0.102,
                    source:         'Ciqual'
                },
                omega3_ala:
                {
                    value:          0.00096,
                    source:         'Ciqual'
                },
                omega3_epa:
                {
                    value:          0.0,
                    source:         'Ciqual'
                },
                omega3_dha:
                {
                    value:          0.0,
                    source:         'Ciqual'
                },
                omega6_la:
                {
                    value:          0.024,
                    source:         'Ciqual'
                },
                omega9:
                {
                    value:          0.0208,
                    source:         'Ciqual'
                },
                salt:
                {
                    value:          0.00014,
                    source:         'Ciqual'
                },
                calcium:
                {
                    value:          8.430e-4,
                    source:         'Ciqual'
                },
                copper:
                {
                    value:          0.3e-5,
                    source:         'Ciqual'
                },
                iron:
                {
                    value:          4.05e-5,
                    source:         'Ciqual'
                },
                iodine:
                {
                    value:          0.5e-8,
                    source:         'Ciqual'
                },
                magnesium:
                {
                    value:          1.480e-3,
                    source:         'Ciqual'
                },
                sodium:
                {
                    value:          5.68e-5,
                    source:         'Ciqual'
                },
                zinc:
                {
                    value:          3.33e-5,
                    source:         'Ciqual'
                },
                vitamin_c:
                {
                    value:          0.0,
                    source:         'Ciqual'
                },
                vitamin_d:
                {
                    value:          0.0,
                    source:         'Ciqual'
                }
            }
        },
        {
            id:                     3,
            title:                  'Lait de soja',
            details:                'vanille, bio',
            months:                 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            product:                'Boisson au soja français, vanille, SOY',
            supplyArea:             2,
            cost:                   2.4,
            environmentalImpact:
            {
                co2eq:
                {
                    kgco2e_kg:      0.417,
                    source:         'Base Carbone ADEME'
                }
            },
            nutrition:
            {
                energy:
                {
                    value:          371.0,
                    source:         'Ciqual'
                },
                proteins:
                {
                    value:          0.0331,
                    source:         'Ciqual'
                },
                carbohydrates:
                {
                    value:          0.007,
                    source:         'Ciqual'
                },
                lipids:
                {
                    value:          0.0207,
                    source:         'Ciqual'
                },
                sugars:
                {
                    value:          0.004,
                    source:         'Ciqual'
                },
                fibers:
                {
                    value:          0.006,
                    source:         'Ciqual'
                },
                omega3_ala:
                {
                    value:          0.0012,
                    source:         'Ciqual'
                },
                omega3_epa:
                {
                    value:          0.0,
                    source:         'Ciqual'
                },
                omega3_dha:
                {
                    value:          0.0,
                    source:         'Ciqual'
                },
                omega6_la:
                {
                    value:          0.0088,
                    source:         'Ciqual'
                },
                omega6_ara:
                {
                    value:          0.0,
                    source:         'Ciqual'
                },
                omega9:
                {
                    value:          0.0037,
                    source:         'Ciqual'
                },
                salt:
                {
                    value:          0.00061,
                    source:         'Ciqual'
                },
                calcium:
                {
                    value:          1.20e-4,
                    source:         'Ciqual'
                },
                copper:
                {
                    value:          0.11e-5,
                    source:         'Ciqual'
                },
                iron:
                {
                    value:          0.41e-5,
                    source:         'Ciqual'
                },
                iodine:
                {
                    value:          2e-7,
                    source:         'Ciqual'
                },
                magnesium:
                {
                    value:          1.60e-4,
                    source:         'Ciqual'
                },
                sodium:
                {
                    value:          2.43e-4,
                    source:         'Ciqual'
                },
                zinc:
                {
                    value:          0.29e-5,
                    source:         'Ciqual'
                },
                vitamin_c:
                {
                    value:          1e-5,
                    source:         'Ciqual'
                },
                vitamin_d:
                {
                    value:          0.5e-8,
                    source:         'Ciqual'
                }
            }
        },
        {
            id:                     4,
            title:                  'Chocolat noir',
            details:                'en vrac, bio',
            months:                 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            supplyArea:             8,
            cost:                   19.32,
            environmentalImpact:
            {
                co2eq:
                {
                    kgco2e_kg:      18.6,
                    source:         'Base Carbone ADEME'
                }
            },
            nutrition:
            {
                energy:
                {
                    value:          5910.0,
                    source:         'Ciqual'
                },
                proteins:
                {
                    value:          0.104,
                    source:         'Ciqual'
                },
                carbohydrates:
                {
                    value:          0.269,
                    source:         'Ciqual'
                },
                lipids:
                {
                    value:          0.463,
                    source:         'Ciqual'
                },
                sugars:
                {
                    value:          0.179,
                    source:         'Ciqual'
                },
                fibers:
                {
                    value:          0.128,
                    source:         'Ciqual'
                },
                omega3_ala:
                {
                    value:          0.0009,
                    source:         'Ciqual'
                },
                omega3_epa:
                {
                    value:          0.0,
                    source:         'Ciqual'
                },
                omega3_dha:
                {
                    value:          0.0004,
                    source:         'Ciqual'
                },
                omega6_la:
                {
                    value:          0.0133,
                    source:         'Ciqual'
                },
                omega6_ara:
                {
                    value:          0.0,
                    source:         'Ciqual'
                },
                omega9:
                {
                    value:          0.137,
                    source:         'Ciqual'
                },
                salt:
                {
                    value:          0.0002,
                    source:         'Ciqual'
                },
                calcium:
                {
                    value:          6.2e-4,
                    source:         'Ciqual'
                },
                copper:
                {
                    value:          1.6e-5,
                    source:         'Ciqual'
                },
                iron:
                {
                    value:          1.1e-4,
                    source:         'Ciqual'
                },
                iodine:
                {
                    value:          2e-7,
                    source:         'Ciqual'
                },
                magnesium:
                {
                    value:          20e-3,
                    source:         'Ciqual'
                },
                sodium:
                {
                    value:          8e-5,
                    source:         'Ciqual'
                },
                zinc:
                {
                    value:          3e-5,
                    source:         'Ciqual'
                },
                vitamin_c:
                {
                    value:          0.5e-5,
                    source:         'Ciqual'
                },
                vitamin_d:
                {
                    value:          2.16e-8,
                    source:         'Ciqual'
                }
            }
        }
    ]
}

class DebugDataProvider extends Parent.AbstractDataProvider
{
    constructor()
    {
        super("Local and volatile database storage. For debug only.");
    }

    connect()
    {
        return true
    }

    getFoods()
    {
        // Extract only the id, title and details fields from data.
        let data = {foods: []}

        for (let i = 0 ; i < gDebugDataProviderData.foods.length ; i++)
        {
            let entry  = gDebugDataProviderData.foods.at(i)
            let copied =
            {
                id:      entry.id,
                title:   entry.title,
                details: entry.details
            }

            data.foods.push(copied)
        }

        return JSON.stringify(data)
    }

    getFoodData(id)
    {
        for (let i = 0 ; i < gDebugDataProviderData.foods.length ; i++)
        {
            let entry = gDebugDataProviderData.foods.at(i)
            if (entry.id == id)
            {
                return JSON.stringify(entry)
            }
        }

        // id not found.
        return '{}'
    }
}

module.exports.DebugDataProvider = DebugDataProvider
