/*
 * s3Wrapper module
 * @module wrappers/s3Wrapper
 */

const utils = require('util');
//requires the s3 AWS object storage Service
const AWS = require('aws-sdk');
const s3Client = new AWS.S3();

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
exports.listObjects = async (bucket, prefix) => {
    const params = {
        Bucket: bucket,
        Prefix: prefix
    };
    const keyList = await getKeys(params);
    return keyList;
};

/**
 *  Funzione ausiliaria che effettua il prelievo delle key da AWS s3 in maniera asincrona
 */
async function getKeys(params, keys = []){
    const response = await s3Client.listObjectsV2(params).promise();
    response.Contents.forEach(obj => keys.push(obj.Key));

    if (response.NextContinuationToken) {
        params.ContinuationToken = response.NextContinuationToken;
        await getAllKeys(params, keys); // RECURSIVE CALL
    }
    return keys;
}