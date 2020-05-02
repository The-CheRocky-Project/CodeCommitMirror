/*
 * snsWrapper module
 * @module wrappers/snsWrapper
 */

//Richiede i moduli sdk necessari e ne crea un istanza
const AWS = require('aws-sdk');
const snsClient = new AWS.SNS();
