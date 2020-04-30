/*
 * s3Wrapper module
 * @module wrappers/s3Wrapper
 */
const utils = require('util');
//requires the s3 AWS object storage Service
const s3Mod = require('aws-sdk/clients/s3');
const s3Client = new s3Mod();

//defaults for bucket and region
let bucket="ahlConsoleBucket";
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
        "thumbnails/" + fileKey);
};

/**
 *  Ritorna la lista dei files contenuti nel bucket settato nel modulo
 */
exports.listObjects = () => {
    let objects = Array();
    s3Client.listObjects({Bucket:bucket},(err,data) => {
        if(err){
            object = false;
            console.log(err, err.stack);
        }
        else{
            for(content in data['Contents'])
                objects.push(content['Key']);
        }
    });
    return objects;
};