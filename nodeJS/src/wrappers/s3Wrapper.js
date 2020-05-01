/*
 * s3Wrapper module
 * @module wrappers/s3Wrapper
 */

const utils = require('util');
//requires the s3 AWS object storage Service
const AWS = require('aws-sdk');
const s3Client = new AWS.S3();

//defaults for bucket and region
let bucket="ahlconsolebucket";
let region="us-east-2";

/**
 *  Imposta il bucket desiderato all'interno del modulo
 * @param {String} bucketName - Rappresenta il bucket che deve essere impostato
 */
exports.setBucket = (bucketName) => {
    bucket=bucketName;
};

/**
 *  Recupera l'url permettendone l'accesso pubblico di un particolare file
 * @param {String} fileKey - Rappresenta la fileKey del quale deve essere fornito
 */
exports.getObjectUrl = (fileKey) => {
    return utils.format('https://%s.s3.%s.amazonaws.com/%s',
        bucket,
        region,
        "thumbnails/" + fileKey + ".jpg");
};

/**
 *  Funzione asincrona che ritorna la lista dei files contenuti nel bucket settato nel modulo
 */
exports.listObjects = async () => {
    const params = {
        Bucket: bucket
    }
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