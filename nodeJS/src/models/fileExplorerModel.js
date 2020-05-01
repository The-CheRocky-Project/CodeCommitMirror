/**
 * File Explorer Model module.
 * @module models/fileExplorerModel
 */
const s3Wrap = require('../wrappers/s3Wrapper');
const snsWrap = require('../wrappers/snsWrapper');

//sets up environment variables
const topicName = "processingTopic";
const bucketName = "ahlconsolebucket";
const AWSregion = "us-east-2";

/**
 * Asynchronously retrieves files from the S3 Wrapped bucket
 */
exports.listFileKeys = async () => {
    return (await s3Wrap.listObjects(bucketName, "origin/")).filter(str => str.endsWith(".mp4"));
}

/**
 * This function returns the URL of a video in a bucket using the S3 Wrapped bucket module
 * @param {String} fileKey - The video file key that has a thumbnail in the bucket
 */
exports.getThumbnailURL = (fileKey) =>{
    return s3Wrap.getObjectUrl(fileKey + ".jpg", bucketName, AWSregion);
}

/**
 * send a message by snsWrap to serverless application to launch the file elaboration
 * @fileKey URL video to elaborate
 */
exports.processFile = (fileKey) =>{
    return snsWrap.message({
        message: "startProcess",
        data: {toProcess: fileKey},
        topic: topicName,
        region: AWSregion
        }
    );
};