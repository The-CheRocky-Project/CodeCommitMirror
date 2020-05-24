/*
 * s3Wrapper module
 * @module wrappers/s3Wrapper
 */

const utils = require('util');
//requires the s3 AWS object storage Service
const AWS = require('aws-sdk');

// /** TODO remove from DevManual
//  *  Imposta il bucket desiderato all'interno del modulo
//  * @param {String} bucketName - Rappresenta il bucket che deve essere impostato
//  */
// exports.setBucket = (bucketName) => {
//     bucket=bucketName;
// };

/**
 *  Fornisce l'url pubblico di un particolare file tramite la sua fileKey.
 * @param {String} fileKey - Rappresenta la fileKey del quale deve essere fornito
 */
exports.getObjectUrl = (fileKey, bucket, region) => {
    return utils.format('https://%s.s3.%s.amazonaws.com/%s',
        bucket,
        region,
        fileKey);
};

/**
 *  Funzione asincrona che ritorna la lista dei files contenuti nel bucket settato nel modulo
 */
exports.listObjects = (bucket, prefix) => {
    const params = {
        Bucket: bucket,
        Prefix: prefix
    };
    const keyList = getKeys(params);
    return keyList;
};

/**
 *  Funzione ausiliaria che effettua il prelievo delle key da AWS s3 in maniera asincrona
 */
//TODO sostituire il metodo getAllkeys con uno esistente e aggiustare la chiamata ricorsiva
async function getKeys(params, keys = []){
    const s3Client = new AWS.S3();
    const response = await s3Client.listObjectsV2(params).promise()
        .catch(error => console.log("Error #" + error.code + error.message));
    response.Contents.forEach(obj => keys.push(obj.Key));

    if (response.NextContinuationToken) {
        params.ContinuationToken = response.NextContinuationToken;
        await getKeys(params, keys); // RECURSIVE CALL
    }
    return keys;
}

/**
 *  Restituisce un dizionario json rappresentante il file fileKey
 *  @param {String} bucket - Il bucket di origine
 *  @param {String} fileKey - La fileKey da deserializzare
 *  @returns {Object} - Dizionario JSON con il contenuto di fileKey
 */
exports.getJsonFile = (bucket,fileKey) =>{
    const param ={
        Bucket: bucket,
        Key: fileKey,
        ResponseContentType: "application/json"
    };
    const dict = getObject(param);
    return dict;
};

/**
 *  Funzione ausiliaria che effettua il prelievo di un oggetto JSON da s3
 *  @param {Dict} params - Dizionario dei parametri per l'accesso al file
 *  @returns {Dict} fileContent - The parsing of the JSON file
 */
async function getObject(params, fileContent = {}){
    const s3Client = new AWS.S3();
    const response = await s3Client.getObject(params).promise()
        .catch(error => console.log("Error #" + error.code + error.message));
    const deserialized = JSON.parse(response.Body.toString());
    const keys = Object.getOwnPropertyNames(deserialized).forEach( key => fileContent[key] = deserialized[key]);
    if (response.NextContinuationToken) {
        params.ContinuationToken = response.NextContinuationToken;
        await getObject(params, keys); // RECURSIVE CALL
    }
    return fileContent;
}