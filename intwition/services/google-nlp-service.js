const language = require('@google-cloud/language');
const googleClient = new language.LanguageServiceClient();

function trimContent(content) {
    console.log('Trimming tweets');
    if (content.length > 1000000) { // not going to reach this. change for NLP api billing
        content = content.slice(0, 999);
    }
    console.log('Number of NLP documents: ' + Math.ceil(content.length / 1000));
    return content;
}

async function analyzeSentiment(content) {

    content = trimContent(content);

    const document = {
        content: content,
        type: 'PLAIN_TEXT',
    };

    console.log('Analyzing sentiment');
    // Detects the sentiment of the text
    const [result] = await googleClient.analyzeSentiment({ document: document });
    return result;
}

module.exports = {
    analyzeSentiment: analyzeSentiment
}