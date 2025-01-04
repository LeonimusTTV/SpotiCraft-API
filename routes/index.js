var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');
require("dotenv").config();

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: 'http://localhost:8080/callback'
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/exchangeCodeForToken', function(req, res, next) {
  if (req.query.code == null) {
    res.send({"error": "No code provided", "success": false});
    return;
  }
  const code = req.query.code;
  spotifyApi.authorizationCodeGrant(code)
    .then(function(data) {
      res.send({"access_token": data.body['access_token'], "refresh_token": data.body['refresh_token'], "expires_in": data.body['expires_in'], "success": true});
    }, function(err) {
      res.send({"success": false});
      console.log('Something went wrong!', err);
    });
})

router.get('/refreshToken', function(req, res, next) {
  if (req.query.refresh_token == null) {
    res.send({"error": "No refresh token provided", "success": false});
    return;
  }
  const refresh_token = req.query.refresh_token;
  spotifyApi.setRefreshToken(refresh_token);
  spotifyApi.refreshAccessToken()
    .then(function(data) {
      res.send({"access_token": data.body['access_token'], "expires_in": data.body['expires_in'], "success": true});
    }, function(err) {
      res.send({"success": false});
      console.log('Could not refresh token', err);
    });
})

module.exports = router;
