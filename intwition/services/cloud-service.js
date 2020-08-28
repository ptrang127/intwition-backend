var stopword = require('stopword');

class CloudService {

    static getCloud(tweets) {

        // combine tweets into array of strings
        let all_words = tweets.join(' ').split(' ');

        // remove stop words
        let filtered_words = stopword.removeStopwords(all_words);
        
        let count = {};

        // count each word count[word] = count
        filtered_words.forEach(word => {
            word = word.toLowerCase();
            word = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
            word = word.replace(/\s{2,}/g, "");
            count[word] = count.hasOwnProperty(word) ? count[word] + 1 : 1;
        });

        // throw into array
        let payload = [];

        // push to payload
        for (var word in count) {
            if (count[word] > 3) {
                let data = {
                    value: word,
                    count: count[word]
                };
                payload.push(data);
            }
        }

        return payload
    }

}

module.exports = CloudService;