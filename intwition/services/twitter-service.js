var Twitter = require('twitter');

var twitter = new Twitter({
    consumer_key: process.env.api_key,
    consumer_secret: process.env.api_secret_key,
    access_token_key: process.env.access_token,
    access_token_secret: process.env.access_token_secret
});

module.exports = twitter;