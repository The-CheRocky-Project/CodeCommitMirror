/*
 * s3Wrapper module
 * @module wrappers/s3Wrapper
 */

//requires the s3 AWS object storage Service
const s3 = require('aws-sdk/clients/s3');

//create a bucket name
let bucket="";

/**
 *  Imposta il bucket desiderato all'interno del modulo
 * @param {object} bucketName - Rappresenta il bucket che deve essere impostato
 */
exports.setBucket = (bucketName) => {
    bucket=bucketName;
};