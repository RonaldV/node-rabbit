var utils = require('./utils');

// Publisher
var pubChannel = null;
var offlinePubQueue = [];

// method to publish a message, will queue messages internally if the connection is down and resend later
exports.publish = function (exchange, routingKey, content) {
  if (!pubChannel) {
    offlinePubQueue.push([exchange, routingKey, content]);
    return;
  }

  try {
    pubChannel.publish(exchange, routingKey, content, { persistent: true },
      function (err, ok) {
        if (err) {
          console.error("[AMQP] publish", err);
          offlinePubQueue.push([exchange, routingKey, content]);
          pubChannel.connection.close();
        }
      });
  } catch (e) {
    console.error("[AMQP] publish", e.message);
    offlinePubQueue.push([exchange, routingKey, content]);
  }
};

exports.start = function (amqpConn) {
  amqpConn.createConfirmChannel(function (err, ch) {
    if (utils.closeOnErr(err, amqpConn)) return;
    ch.on("error", function (err) {
      console.error("[AMQP] publisher channel error", err.message);
    });
    ch.on("close", function () {
      pubChannel = null;
      console.log("[AMQP] publisher channel closed");
    });

    pubChannel = ch;

    while (true) {
      var m = offlinePubQueue.shift();
      if (!m) break;
      exports.publish(m[0], m[1], m[2]);
    }
  });
};
