var express = require('express');
var router = express.Router();
var twitter = require('../services/twitter-service');
var Sentiment = require('sentiment');
var sentiment = new Sentiment();
var textService = require('../services/text-service');
var stopWordService = require('stopword');


/* GET sentiment given a term. */
router.get('/term/:term', function (req, res, next) {
  twitter.get('search/tweets', { q: req.params.term + " -filter:retweets", lang: 'en', result_type: 'mixed', count: 100, tweet_mode: 'extended' }, function (error, tweets, response) {

    let tweet_array = tweets.statuses.map(tweet => {
      return tweet.full_text;
    });

    let sentiments = tweet_array.map(tweet => {
      return {
        text: tweet,
        sentiment: sentiment.analyze(tweet)
      };
    });

    let scores = sentiments.map(sentiment => {
      return sentiment.sentiment.score;
    });

    let comparative_scores = sentiments.map(sentiment => {
      return sentiment.sentiment.comparative;
    });

    const arrSum = arr => arr.reduce((a, b) => a + b, 0);
    const arrAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

    let sum = arrSum(scores);
    let avg = arrAvg(scores);
    let sum_comparative = arrSum(comparative_scores);
    let avg_comparative = arrAvg(comparative_scores);

    let result = '';
    if (sum_comparative < -4) {
      result = "Very Negative";
    } else if (sum_comparative < -2) {
      result = "Negative";
    } else if (sum_comparative < 2) {
      result = "Neutral";
    } else if (sum_comparative < 4) {
      result = "Positive";
    } else {
      result = "Very Positive";
    }

    let all_words = tweet_array.join(' ').split(' ');
    let filtered_words = stopWordService.removeStopwords(all_words);
    let cloud = textService.countWords(filtered_words, 0);

    res.send({
      sum_score: sum,
      avg_score: avg,
      sum_comparative: sum_comparative,
      avg_comparative, avg_comparative,
      result: result,
      length: scores.length,
      tweets: tweet_array,
      cloud: cloud
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