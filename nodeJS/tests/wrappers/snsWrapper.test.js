const assert = require('assert');
const snsWrap=require('../../src/wrappers/snsWrapper');
var AWSMock = require('aws-sdk-mock');
var rewire = require("rewire");
var snsRewire = rewire("../../src/wrappers/snsWrapper.js");
const mock = require('mock-require');

describe('testSnsWrapper',() => {

  beforeEach(() => {
    let topic = 'myTopic';
    let region = 'us-east-2';
    let userCode = 'myCode';
  });



  describe('#getTopicArn()', () => {

    it("deve restituire l'ARN correttamente calcolato di un topic", () => {
      let expectedARN="arn:aws:sns:"+this.region+":"+this.userCode+":"+this.topic;
      let arn = snsWrap.getTopicArn(this.topic, this.region, this.userCode);
      assert.strictEqual(arn, expectedARN);
    });
  });

  describe('#publisher()', ()=> {

    it("effettuazione della pubblicazione di un messaggio con esito positivo", (done) => {
      let params = { Message: JSON.stringify({ data: 'Message to send'})};
      var publisher= snsRewire.__get__("publisher");
      AWSMock.mock('SNS', 'publish', (params, callback) => {
        callback(null, 'success'); // Mocked response returns ‘success’ always
      });
      var expectedValue=true;
      var result= publisher(params);
      result.then(function (res) {
        assert.deepStrictEqual(res,expectedValue);
        done();
      }).catch(function (errOnAssert) {
        done(new Error(errOnAssert));
      })
    });

    it("la pubblicazione di un messaggio da esito negativo", (done) => {
      let params = { Message: JSON.stringify({ data: 'Message to send'})};
      var publisher= snsRewire.__get__("publisher"); //importa la funzione privata "publisher"
      AWSMock.mock('SNS', 'publish', (params, callback) => {
        callback('err', null); // Mocked response returns error always
      });
      var expectedValue=false;
      var result= publisher(params)
      result.then((res) => {
          assert.deepStrictEqual(res,expectedValue);
          done();
      }).catch((errOnAssert) => {done(new Error(errOnAssert));});
    });

    afterEach(()=>{
      AWSMock.restore('SNS', 'publish');
    });
  });

  describe('#sendMessage()', ()=> {
    it("TopicPublisher deve pubblicare un messaggio con esito positivo", (done) => {
      let topic_publisher= new snsWrap.TopicPublisher(this.topic, this.userCode, this.region);
      let msg='msg', data='data', dataFormat='dataFormat';
      AWSMock.mock('SNS', 'publish', (params, callback) => {
        callback(null, 'success'); // Mocked response returns error always
      });
      var expectedValue=true;
      var result= topic_publisher.sendMessage(msg, data, dataFormat);
      result.then((res) => {
          assert.deepStrictEqual(res,expectedValue);
          done();
      }).catch((errOnAssert) => {done(new Error(errOnAssert));});
      AWSMock.restore('SNS', 'publish');
    });
  });

  describe('#confirmTopic()', () => {

    it("Confirm di un topic", (done) => {

      AWSMock.mock('SNS', 'confirmSubscription', (params, callback) => {
        callback(null, 'success'); // Mocked response returns error always
      });

      var topicARN = 'topicArn'
      var token = 'token'

      var result = snsWrap.confirmTopic(topicARN, token).then(
        (data) => {
          assert.strictEqual(data, true);
          done();
        }
      );

    });

    it("Confirm di un topic", (done) => {

      AWSMock.mock('SNS', 'confirmSubscription', (params, callback) => {
        callback("error", null); // Mocked response returns error always
      });

      var topicARN = 'topicArn'
      var token = 'token'

      var result = snsWrap.confirmTopic(topicARN, token).then(
        (data) => {
          assert.strictEqual(data, false);
          done();
        }
      ).catch((errOnAssert) => {done(new Error(errOnAssert));});

    });

    afterEach(()=>{
      AWSMock.restore('SNS', 'confirmSubscription');
    });

  });
  describe('#createTopicSubscription()', () => {

    it("Create di un topic", (done) => {

      AWSMock.mock('SNS', 'subscribe', (params, callback) => {
        callback(null, 'success'); // Mocked response returns error always
      });

      var topicName = this.topic
      var endpoint = 'endpoint'
      var userCode = this.userCode

      var result = snsWrap.createTopicSubscription(topicName,endpoint, userCode).then(
        (data) => {
          assert.strictEqual(data, true);
          done();
        }
      );

    });

    it("Create di un topic wrong", (done) => {

      AWSMock.mock('SNS', 'subscribe', (params, callback) => {
        callback('ERRORE', null); // Mocked response returns error always
      });

      var topicName = this.topic
      var endpoint = 'endpoint'
      var userCode = this.userCode

      var result = snsWrap.createTopicSubscription(topicName,endpoint, userCode).then(
        (data) => {
          assert.strictEqual(data, false);
          done();
        }
      ).catch((errOnAssert) => {done(new Error(errOnAssert));});

    });

    afterEach(()=>{
      AWSMock.restore('SNS', 'subscribe');
    });

  });
});
