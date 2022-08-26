// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

var Parent = require('./AbstractEntryPoint')

class DeleteFood extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('deleteFood')
    }

    executeImplementation(req, res)
    {
        // Get food id.
        let id = req.params.id

        let promise = this.dataProvider.deleteFood(id)
        promise.then(data => res.send(data))
    }
}

module.exports.DeleteFood = DeleteFood
