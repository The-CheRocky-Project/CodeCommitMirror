/**
 * File Explorer Model module.
 * @module models/fileExplorerModel
 */
const s3Wrap = require('../wrappers/s3Wrapper');
//const snsWrap = require('../wrappers/snsWrapper');

/**
 * Asynchronously retrieves files from the S3 Wrapped bucket
 */
exports.listFileKeys = async () => {
    return await s3Wrap.listObjects();
}

/**
 * This function returns the URL of a video in a bucket using the S3 Wrapped bucket module
 * @param {String} fileKey - The video file key that has a thumbnail in the bucket
 */
exports.getThumbnailURL = (fileKey) =>{
    return s3Wrap.getObjectUrl(fileKey);
}

/**
 * send a message by snsWrap to serverless application to launch the file elaboration
 * @fileKey URL video to elaborate
 */
exports.processFile = (fileKey) =>{
    return sns.message({
        message: "start process",
        data: fileKey
        }
    );
};