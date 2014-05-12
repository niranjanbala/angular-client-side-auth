var querystring = require('querystring');
var http = require('http');

exports.PostRequest= function(actionRoute, postDataObject, callback) {
  // Build the post string from an object
  var post_data = querystring.stringify(postDataObject);  
  // An object of options to indicate where to post to
  var post_options = {
      host: 'damp-hamlet-4560.herokuapp.com',
      port: '80',
      path: actionRoute,
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': post_data.length
      }
  };  
  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          callback(chunk);
      });
  });  
  // post the data
  post_req.write(post_data);
  post_req.end();
}