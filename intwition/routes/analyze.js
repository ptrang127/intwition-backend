var express = require('express');
var router = express.Router();
const TwitterSerivce = require('../services/twitter-service');
const GoogleNlpService = require('../services/google-nlp-service');
var SentimentService = require('../services/sentiment-service');
var CloudService = require('../services/cloud-service');

/* GET sentiment given a term. */
router.get('/term/:term', async function (req, res, next) {

    let tweets = await TwitterSerivce.getTweetsByQuery(req.params.term);

    let tweet_array = tweets.map(tweet => {
        return tweet.full_text;
    });

    let sentiment_result = SentimentService.getSentiment(tweet_array);
    let cloud_result = CloudService.getCloud(tweet_array);
    let sentiment = await GoogleNlpService.analyzeSentiment(tweet_array.join(' '));

    res.send({
        google_sentiment: sentiment.documentSentiment,
        sentiment: sentiment_result,
        cloud: cloud_result,
        tweets: tweets
    });

});

module.exports = router;