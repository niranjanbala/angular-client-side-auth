var _ =           require('underscore')
    , User =      require('../models/User.js')
    , userRoles = require('../../client/js/routingConfig').userRoles
    , HttpPost=require('../models/HttpPost');

module.exports = {
    index: function(req, res) {
        var users = User.findAll();
        _.each(users, function(user) {
            delete user.password;
            delete user.twitter;
            delete user.facebook;
            delete user.google;
            delete user.linkedin;
        });
        res.json(users);
    },
    getMyDetails: function(req, res) {
        console.log(req.session.token);
        console.log(req.session.userId);
        HttpPost.PostRequest('/v3/user/'+req.session.userId+'/profile/details',{
            'server_auth_token':req.session.token
        },function (response) {            
            res.json(JSON.parse(response));                        
        });        
    }
};