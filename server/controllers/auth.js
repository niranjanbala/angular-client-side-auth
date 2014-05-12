var passport =  require('passport')
    , User = require('../models/User.js');
module.exports = {
    register: function(req, res, next) {
    },

    login: function(req, res, next) {
 		passport.authenticate('local', function(err, user) {
 			console.log("found",user); 			
            if(err)     { return next(err); }
            if(!user)   { return res.send(400); }

            req.logIn(user, function(err) {
                if(err) {
                    return next(err);
                }
                console.log(user);
                req.session.token=user.token;
                req.session.userId=user.id;
                req.session.cookie.token=user.token;
                if(req.body.rememberme) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;                
                res.json(200, { "role": user.role, "username": user.userName });
            });
        })(req, res, next);    	
    },

    logout: function(req, res) {        
        req.logout();
        res.send(200);
    }
};