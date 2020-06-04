/*
 * snsWrapper module
 * @module wrappers/snsWrapper
 */


//Richiede i moduli sdk necessari e ne crea un istanza
process.env.AWS_REGION = "us-east-2";
const AWS = require('aws-sdk');


/**
 * Funzione ausiliaria che calcola l'arn di un topic
 * @param {String} topic - Il topic di cui si vuole calcolare l'arn
 * @param {String} region - La region dove è presente quel topic
 * @param {String} userCode - Il codice utente AWS del proprietario del topic
 * @returns {string} - L'arn del topic
 */
function getTopicArn(topic, region, userCode) {
    return "arn:aws:sns:" +
        region +
        ":" +
        userCode +
        ":" +
        topic;
}

/**
 * Classe rappresentante un topic
 */
class TopicPublisher{
    /**
     * Costruttore per un oggetto TopicPublisher
     * @param {String} topic - il target topic per i messaggi
     * @param {String} region - la region del topic
     * @param {String} userCode - il codice utente AWS del proprietario del topic
     */
    constructor(topic,region,userCode){
        this.topic = topic;
        this.region = region;
        this.userCode = userCode;
        this.arn = getTopicArn(this.topic, this.region, this.userCode);
    }

    /**
     * Funzione asincrona che invia un messaggio
     * @param {String} message - Il messaggio
     * @param {Object} data - Il payload del messaggio
     * @param {String} dataFormat - Il formato del payload
     * @returns {Promise<Boolean>} - L'esito della richiesta
     */
    //TODO controlloare se correzioni fatte nelle altre funzioni che invoca sendMessage è corretto
    sendMessage(message, data, dataFormat){
        let payload = Object();
        Object.entries(data).forEach(([key, value]) => {
            let record = Object();
            record.DataType = "String";
            record.StringValue = value;
            payload[key] = record;
        });
        return publisher({
            Message: message,
            MessageAttributes: payload,
            TopicArn: this.arn
        });
    }
}
// TODO test
function confirmTopic(topicArn, Token) {
    const data = {
        "Token": Token,
        "TopicArn": topicArn
    }
    return confirmRequest(data);
}


/**
 * Funzione ausiliaria asincrona che effettua la pubblicazione di un messaggio
 * @param {Dict} params - I parametri di invio
 * @returns {Promise<Boolean>} - L'esito della richiesta di invio messaggio
 */
async function publisher(params){
    const snsClient = new AWS.SNS();
    let result = false;
    // Wait for SNS call
    await snsClient.publish(params)
        .promise()
        .then(data => result=true)
        .catch(err => console.log("Errore SNS #" + err.code + ": " + err.message));
    return result;
}
// TODO test
async function confirmRequest(requestBody) {
    const snsClient = new AWS.SNS();
    let result = false;
    await snsClient.confirmSubscription(requestBody)
        .promise()
        .then(data => result=true)
        .catch(err => console.log("***Conf err " + err, err.message));
    return result
}
// TODO test
function createTopicSubscription(topicName,endpoint, userCode) {
    const topicArn = this.getTopicArn(topicName,process.env.AWS_REGION,userCode)
    return createSubscription("HTTP", topicArn, endpoint);
}
// TODO test
async function createSubscription(protocol, topicArn, endpoint) {
    const snsClient = new AWS.SNS();
    let result = false;
    await snsClient.subscribe({
        "Protocol": protocol,
        "TopicArn": topicArn,
        "Endpoint": endpoint
    }).promise()
        .then(data => result = true)
        .catch(err => console.log("Errore di creazione subscription " + err, err.message));
    return result;
}

exports.TopicPublisher = TopicPublisher;
exports.getTopicArn = getTopicArn;
exports.confirmTopic = confirmTopic;
exports.createTopicSubscription = createTopicSubscription;