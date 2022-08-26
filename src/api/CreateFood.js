// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

var Parent = require('./AbstractEntryPoint')

class CreateFood extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('createFood')
    }

    executeImplementation(req, res)
    {
        let promise = this.dataProvider.createFood()
        promise.then(data => res.send(data))
    }
}

module.exports.CreateFood = CreateFood
