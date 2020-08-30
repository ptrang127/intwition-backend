var express = require('express');
var router = express.Router();
const TwitterSerivce = require('../services/twitter-service');
const GoogleNlpService = require('../services/google-nlp-service');
const FirestoreService = require('../services/firestore-service');
var SentimentService = require('../services/sentiment-service');
var CloudService = require('../services/cloud-service');

/* GET sentiment given a term. */
router.get('/term/:term', async function (req, res, next) {

    const query = req.params.term;
    let tweets = await TwitterSerivce.getTweetsByQuery(query);

    let tweet_array = tweets.map(tweet => {
        return tweet.full_text;
    });

    let sentiment_result = SentimentService.getSentiment(tweet_array);
    let cloud_result = CloudService.getCloud(tweet_array);

    const doc = await FirestoreService.readQuery(query);
    let sentiment;

    if (doc.exists) {
        const documentEpoch = doc.data().timestamp._seconds;
        const currentEpoch = new Date() / 1000;

        // if document older than a day
        if (Math.abs(documentEpoch - currentEpoch) > 86400) {
            sentiment = await GoogleNlpService.analyzeSentiment(tweet_array.join('\n'));
            sentiment = sentiment.documentSentiment;
            await FirestoreService.updateQuery(query, sentiment);
        } else {
            sentiment = doc.data().sentiment;
        }
    } else {
        sentiment = await GoogleNlpService.analyzeSentiment(tweet_array.join('\n'));
        sentiment = sentiment.documentSentiment;
        await FirestoreService.addQuery(query, sentiment);
    }

    res.send({
        sentiment: sentiment,
        old_sentiment: sentiment_result,
        cloud: cloud_result,
        tweets: tweets
    });

});

module.exports = router;