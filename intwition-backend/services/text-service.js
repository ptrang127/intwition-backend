module.exports = {

    // string => string
    removePunctuation: function (word) {
        let result;
        result = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        result = result.replace(/\s{2,}/g, "");
        return result;
    },

    // [string] => [{ value: string, count: integer }]
    countWords: function (words, min_count) {

        let count = {};

        // count each word count[word] = count
        words.forEach(word => {
            word = word.toLowerCase();
            word = this.removePunctuation(word);
            count[word] = count.hasOwnProperty(word) ? count[word] + 1 : 1;
            
        });

        // throw into array
        let result = [];
        for (var word in count) {
            if (count[word] > min_count) {
                let data = {
                    value: word,
                    count: count[word]
                };
                result.push(data);
            }
        }

        return result;
    }

}