const Sentiment = require('sentiment');
const sentiment = new Sentiment();
const arrSum = arr => arr.reduce((a, b) => a + b, 0);

class SentimentService {
    static getSentiment(tweets) {

        // analyze each tweet
        let sentiments = tweets.map(tweet => {
            return sentiment.analyze(tweet);
        });

        // get the sum scores
        let scores = sentiments.map(sentiment => {
            return sentiment.score
        });

        // get the comparative scores
        let comparative_scores = sentiments.map(sentiment => {
            return sentiment.comparative;
        })

        // add together
        let sum_score = arrSum(scores);
        let sum_comparative = arrSum(comparative_scores);

        // find the emotion
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

        let payload = {
            score: sum_score,
            comparative: sum_comparative,
            result: result
        }

        return payload
    }
}

module.exports = SentimentService;