const Sentiment = require('sentiment');
const sentiment = new Sentiment();
const arrSum = arr => arr.reduce((a, b) => a + b, 0);

class SentimentService {
    static getSentiment(tweets) {

        // analyze each tweet
        let sentiments = tweets.map(tweet => {
            return sentiment.analyze(tweet);
        });

        // get count negative words
        let negative_count = sentiments.reduce(function (acc, obj) {
            return acc + obj.negative.length
        }, 0)

        // get count positive words
        let positive_count = sentiments.reduce(function (acc, obj) {
            return acc + obj.positive.length
        }, 0)

        // get count tokens
        let token_count = sentiments.reduce(function (acc, obj) {
            return acc + obj.tokens.length
        }, 0)

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
        if (sum_comparative < -3.5) {
            result = "Very Negative";
        } else if (sum_comparative < -1.5) {
            result = "Negative";
        } else if (sum_comparative < 1.5) {
            result = "Neutral";
        } else if (sum_comparative < 3.5) {
            result = "Positive";
        } else {
            result = "Very Positive";
        }

        let difference = Math.abs(positive_count - negative_count);
        let overall_sentiment = "The overall sentiment for the given query is " + result + ". ";
        let certainty = "The strength and certainty of this sentiment is " + (Math.abs(sum_score) > 100 ? "strong. " : "weak. ");
        let comparison = "There were " + difference + (positive_count - negative_count > 0 ? Math.abs(positive_count - negative_count) + " more positive words than negative words." : " more negative words than positive words.");

        let summary = "";
        summary = summary.concat(overall_sentiment, certainty, comparison);

        let payload = {
            token_count: token_count,
            positive_count: positive_count,
            negative_count: negative_count,
            sum_score: sum_score,
            comparative_score: sum_comparative,
            result: result,
            summary: summary
        }

        console.log(payload);

        return payload
    }
}

module.exports = SentimentService;