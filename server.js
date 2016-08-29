/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: 'l6exIhHyPPDw1frD8ATzfu2BD',
  consumer_secret: 'vmzqTdyB64xFSZadMChOVNMPfTV3m9nep5MR7HzgvjTWIxQPWz',
  access_token_key: '159924354-gZHXPPyeGwNO3cdcHN6orFutuSmxthRn1zZVwRSm',
  access_token_secret: 'c6mvuYRAqs7ZgNsF3udIkLNV4iiRoGDw9XTbzXHzN03tf'
});

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get fresh stuff.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.post('/api/hashtags', function(req, res) {
  // params sent on get request to twitter API
  // q: for finding tweets that are related to user input text
  // count: for getting 100 tweets (max allowed tweets number per request) so we can have more tweets to look for hashtags
  // lang: english to avoid seeing weird symbols that most of us don't understand or at least the developer who did this :).
  var params = {q: req.body.text, count: 100, lang: 'en'};
  var data = [];
  var data_index = 0;
  var data_suggestions = [];
  var data_suggestions_index = 0;
  // fixed suggestions for worst case scenario where all tweets retrieved by twitter API contains no hashtags
  var fixed_data_suggestions = ['Nintendo', 'PokemonGo', 'Independiente', 'Libertadores', 'Fox', 'Rio2016'];
  var is_suggestion = 0;
  // Making get request to twitter API for tweets.
  client.get('search/tweets', params, function(error, tweets, response){
    if (!error) {
      // Looping through tweets statuses returned by get request.
      for(var i = 0; i < tweets.statuses.length; i++) {
        // obj contains tweet object.
        var obj = tweets.statuses[i];
        // Looping through tweet hashtags if they exist
        for(var j = 0; j < obj.entities.hashtags.length; j++) {
          // Checking if hashtag is already on hashtags data array
          if (-1 == (data.indexOf(obj.entities.hashtags[j].text))) {
            // regex obj to find occurrences of input text on current hashtag
            var regex = new RegExp( req.body.text, 'i' );
            // filling match variable with either match or null
            var match = obj.entities.hashtags[j].text.match(regex);
            // if there is a match we would add the hashtag to data array
            if (null != match) {
              data[data_index++] = obj.entities.hashtags[j].text;
            }
          }
          // Checking if hashtag is already on hashtags data suggestions array 
          // and data suggestions array length is not yet 6
          if (-1 == (data_suggestions.indexOf(obj.entities.hashtags[j].text)) && data_suggestions.length < 6) {
            // adding hashtag to data suggestions array
            data_suggestions[data_suggestions_index++] = obj.entities.hashtags[j].text;
          }
        }
      }
      // declaring json that will contain response data
      var response = {};

      // checking if hashtags array is not empty
      if (data.length > 0) {
        // flag variable to know that response is not filled with suggestions but with real hashtags
        // that matched user input
        is_suggestion = 0;
      }
      else if (data_suggestions.length > 0) {
        // if data is empty that means we will return suggestions, because there were no matches for user input
        is_suggestion = 1;
        // filling data variable with data suggestions array, as data itself was empty
        data = data_suggestions;
      } else {
        // worst case scenario we couldn't neither find matches for hashtags nor suggestions which means
        // on all tweets retrieved there were no hashtags on them, all empty.
        is_suggestion = 1;
        // filling data with fixed suggestions.
        data = fixed_data_suggestions;
      }
      // declaring that response will contain various objects.
      response = [];
      // looping through data to fill response variable with needed properties for frontend data manipulation
      for(var i = 0; i < data.length; i++) {
        // each response key would be a json object
        response[i] = {};
        // setting properties for each response key json object
        response[i].text = data[i];
        response[i].id = i;
        response[i].is_suggestion = is_suggestion;
      }
      // send response
      res.json(response);
    }
  });
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
