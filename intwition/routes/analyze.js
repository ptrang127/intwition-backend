var express = require('express');
var router = express.Router();
var TwitterSerivce = require('../services/twitter-service');
var SentimentService = require('../services/sentiment-service');
var CloudService = require('../services/cloud-service');

async function quickstart() {
    // Imports the Google Cloud client library
    const language = require('@google-cloud/language');

    // Instantiates a client
    const client = new language.LanguageServiceClient();

    // The text to analyze
    const text = 'Hello, world!';

    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };

    // Detects the sentiment of the text
    const [result] = await client.analyzeSentiment({ document: document });
    const sentiment = result.documentSentiment;

    return result;
}

/* GET sentiment given a term. */
router.get('/term/:term', async function (req, res, next) {

    let twit = new TwitterSerivce();

    let tweets = await twit.getTweetsByQuery(req.params.term);

    let tweet_array = tweets.map(tweet => {
        return tweet.full_text;
    });

    let sentiment_result = SentimentService.getSentiment(tweet_array);
    let cloud_result = CloudService.getCloud(tweet_array);

    quickstart();

    res.send({
        sentiment: sentiment_result,
        cloud: cloud_result,
        tweets: tweets
    });

});

/* GET sentiment given an account. */
router.get('/sentiment/:term', async function (req, res, next) {
    let test = await quickstart();
    res.send(test);
});

/* GET sentiment given a hashtag. */
router.get('/hashtag', function (req, res, next) {
    res.send(req.params.hashtag);
});

module.exports = router;