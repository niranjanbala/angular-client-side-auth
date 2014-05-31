var _ =           require('underscore')
    , User =      require('../models/User.js')
    , userRoles = require('../../client/js/routingConfig').userRoles
    , HttpPost=require('../models/HttpPost');

module.exports = {
    getFeedDetails: function(req, res) {        
        var action=req.query.action;
        console.log(action);
        if(action) {
            if(action=='after') {
                var timestamp=req.query.max_id;
                console.log(timestamp);
                HttpPost.PostRequest('/v3/feed/list/after/'+timestamp,{
                    'server_auth_token':req.session.token
                },function (response) {
                    res.write("instagramReceiverFrontAppend("+response+")"); 
                    res.send();
                });            
            } else {
                var timestamp=req.query.min_id;
                console.log(timestamp);
                HttpPost.PostRequest('/v3/feed/list/before/'+timestamp,{
                    'server_auth_token':req.session.token
                },function (response) {
                    res.write("instagramReceiverRearAppend("+response+")"); 
                    res.send();
                });                            
            }
        } else {
            HttpPost.PostRequest('/v3/feed/list',{
                'server_auth_token':req.session.token
            },function (response) {
                res.write("instagramReceiverReplace("+response+")"); 
                res.send();
            });            
        }
    }
};