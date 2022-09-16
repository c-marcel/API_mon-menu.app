// Copyright Clément MARCEL (NWANDA) 2022. All Rights Reserved.
// This file is licensed under the GNU Affero GPL v3.
// License text available at https://www.gnu.org/licenses/agpl-3.0.txt

"use strict";

// The Connect object implements the '/connect' entry point that
// permits to user to connect to the private part of the Api.

var Parent = require('../AbstractEntryPoint')

/**
  * @api {get} /connect Connect user to private Api
  * @apiDescription Check if provided credentials are valid for user for using private
  * part of the Api. This call will return user details (user level).
  * @apiName connect
  * @apiGroup Users
  * @apiVersion 1.0.0
  * 
  * @apiQuery {String} username Username.
  * @apiQuery {String} password Password.
  *
  * @apiSuccess {String} level User level ('user' or 'admin').
  * 
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *         "level": "admin"
  *     }
  */
class Connect extends Parent.AbstractEntryPoint
{
    constructor()
    {
        super('connect', false)
    }

    executeImplementation(req, res)
    {
        // Get user credentials.
        let username = req.query.username
        let password = req.query.password

        let promise = this.userManager.getUserDataDelayed(username, password)
        promise.then(data => 
        {
            // Save data to session.
            if (data.code == 200)
            {
                req.session.data = data.data
            }

            else
            {
                req.session.destroy();
            }

            res.status(data.code)
            res.send(data.data)
        })
    }
}

module.exports.Connect = Connect
