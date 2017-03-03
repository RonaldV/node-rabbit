var utils = require('./utils');

var queue = 'jobs';

// Worker (Consumer)
function work(msg, cb) {
  console.log("Got msg", msg.content.toString());
  cb(true);
}

exports.queue = queue;

// A worker that acks messages only if processed succesfully
exports.start = function (amqpConn) {
  amqpConn.createChannel(function (err, ch) {
    if (utils.closeOnErr(err, amqpConn)) return;
    ch.on("error", function (err) {
      console.error("[AMQP] consumer channel error", err.message);
    });
    ch.on("close", function () {
      console.log("[AMQP] consumer channel closed");
    });
    ch.prefetch(10);

    function processMsg(msg) {
      work(msg, function (ok) {
        try {
          if (ok)
            ch.ack(msg);
          else
            ch.reject(msg, true);
        } catch (e) {
          utils.closeOnErr(e, amqpConn);
        }
      });
    }

    ch.assertQueue(queue, { durable: true }, function (err, _ok) {
      if (utils.closeOnErr(err, amqpConn)) return;
      ch.consume(queue, processMsg, { noAck: false });
      console.log("Worker is started");
    });
  });
};
