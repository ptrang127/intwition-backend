var express = require('express');
var router = express.Router();
var twitter = require('../services/twitter-service');
var SentimentService = require('../services/sentiment-service');
var CloudService = require('../services/cloud-service');

/* GET sentiment given a term. */
router.get('/term/:term', function (req, res, next) {
    twitter.get('search/tweets', { q: req.params.term + " -filter:retweets", lang: 'en', result_type: 'mixed', count: 100, tweet_mode: 'extended' }, function (error, tweets, response) {

        // get all tweets and store in array
        let tweet_array = tweets.statuses.map(tweet => {
            return tweet.full_text;
        });

        let sentiment_result = SentimentService.getSentiment(tweet_array);
        let cloud_result = CloudService.getCloud(tweet_array);

        res.send({
            sentiment: sentiment_result,
            cloud: cloud_result,
            tweets: tweets
        });

    });

});

/* GET sentiment given an account. */
router.get('/account/:account', function (req, res, next) {
    res.send(req.params.account);
});

/* GET sentiment given a hashtag. */
router.get('/hashtag', function (req, res, next) {
    res.send(req.params.hashtag);
});

module.exports = router;