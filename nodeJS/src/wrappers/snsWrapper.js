/*
 * snsWrapper module
 * @module wrappers/snsWrapper
 */

const Buffer = require('buffer').Buffer;

//Richiede i moduli sdk necessari e ne crea un istanza

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
     * @param {dataFormat} data - Il payload del messaggio
     * @param {mimeType} dataFormat - Il formato del payload
     * @returns {Promise<Boolean>} - L'esito della richiesta
     */
    //TODO aggiustare in caso si decida di utilizzare nel modello la funzione snsWrap.message
    sendMessage(message, data, dataFormat){
        return publisher({
            Message: message,
            MessageAttributes: {
                'data': {
                    DataType: dataFormat,
                    BinaryValue: Buffer.from(data)
                }
            },
            TopicArn: this.arn
        });
    }
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

exports.TopicPublisher= TopicPublisher;
exports.getTopicArn= getTopicArn;
