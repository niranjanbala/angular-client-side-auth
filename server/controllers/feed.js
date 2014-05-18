var _ =           require('underscore')
    , User =      require('../models/User.js')
    , userRoles = require('../../client/js/routingConfig').userRoles
    , HttpPost=require('../models/HttpPost');

module.exports = {
    getFeedDetails: function(req, res) {
        console.log(req.session.token);
        console.log(req.session.userId);
        HttpPost.PostRequest('/v3/feed/list',{
            'server_auth_token':req.session.token
        },function (response) {
            res.json(JSON.parse(response)); 
        });        
    }
};