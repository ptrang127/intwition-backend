const language = require('@google-cloud/language');
const googleClient = new language.LanguageServiceClient();

function trimContent(content) {
    // Ensure document is less than 1,000 characters
    if (content.length > 1000) {
        content = content.slice(0, 999);
    }
    return content;
}

async function analyzeSentiment(content) {

    content = trimContent(content);

    const document = {
        content: content,
        type: 'PLAIN_TEXT',
    };

    // Detects the sentiment of the text
    const [result] = await googleClient.analyzeSentiment({ document: document });
    return result;
}

module.exports = {
    analyzeSentiment: analyzeSentiment
}