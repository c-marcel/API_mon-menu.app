// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

var Parent = require('./AbstractEntryPoint')

class UpdateFood extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('updateFood')
    }

    executeImplementation(req, res)
    {
        let promise = this.dataProvider.updateFood(req.body)
        promise.then(data => res.send(data))
    }
}

module.exports.UpdateFood = UpdateFood
