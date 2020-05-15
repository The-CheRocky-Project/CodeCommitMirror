class TopicPublisher {
  constructor(topic,region,userCode) {
        this.topic = topic;
        this.region = region;
        this.userCode = userCode;
  }

  sendMessage(message, data, dataFormat) {
      return true;
  }
};

exports.TopicPublisher = TopicPublisher;
