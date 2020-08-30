const Twitter = require('twitter');
const twitterClient = new Twitter({
    consumer_key: process.env.api_key,
    consumer_secret: process.env.api_secret_key,
    access_token_key: process.env.access_token,
    access_token_secret: process.env.access_token_secret
});
// const twitterKey = require('../api-keys/twitter.json');
// const twitterClient = new Twitter(twitterKey);

async function getTweetsByQuery(query) {
    console.log('Getting tweets');
    var statuses = []; // array of statuses
    var id_set = new Set();
    var max = 0;
    var min_tweet = Number.MAX_VALUE;
    for (let i = 0; i < 5; i++) {
        let response = await twitterClient.get('search/tweets', { q: query + " -filter:links -filters:replies -filter:retweets", lang: 'en', result_type: 'mixed', count: 100, max_id: max, tweet_mode: 'extended' });
        response.statuses.forEach(status => {
            min_tweet = Math.min(status.id, min_tweet) - 500;
            statuses.push(status);
            id_set.add(status.id);
        });
        max = min_tweet;
        console.log('Max tweet ID: ' + max);
    }
    console.log('Number of tweets: ' + id_set.size)
    return statuses;
}

module.exports = {
    getTweetsByQuery: getTweetsByQuery
}