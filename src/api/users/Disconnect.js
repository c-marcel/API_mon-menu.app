// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

// The Disconnect object implements the '/disconnect' entry point that
// permits to user to disconnect from the private part of the Api.

var Parent = require('../AbstractEntryPoint')

/**
  * @api {get} /disconnect Disconnect user from private Api
  * @apiDescription Disconnet user (use session).
  * @apiName disconnect
  * @apiGroup Users
  * @apiVersion 1.0.0
  * @apiPrivate
  */
class Disconnect extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('disconnect', true)
    }

    executeImplementation(req, res)
    {
        // Destroy session.
        req.session.destroy();

        res.status(200)
        res.send("")
    }
}

module.exports.Disconnect = Disconnect
