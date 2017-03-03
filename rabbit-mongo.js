// TODO create new MongoDB sample ... rabbit-mongo.js
// TODO Promise based version of rabbit-mongo.js ... rabbit-mongo-promise.js
//    https://github.com/squaremo/amqp.node
// TODO put on my Bitbucket
// TODO ES6/2015 version of rabbit-mongo-promise.js ... rabbit-mongo-es6.js
//    https://mongodb.github.io/node-mongodb-native/2.2/reference/ecmascript6/crud/

require('dotenv').config();

var amqp = require('amqplib/callback_api');

var db = require('./rabbit-mongo/db');

var consumer = require('./rabbit-mongo/consumer');
var publisher = require('./rabbit-mongo/publisher');


function whenConnected(amqpConn) {
  publisher.start(amqpConn);
  consumer.start(amqpConn);
}

// if the connection is closed or fails to be established at all, we will reconnect
function start() {
  amqp.connect(process.env.AMQP_URL + "?heartbeat=60", function (err, conn) {
    if (err) {
      console.error("[AMQP]", err.message);
      return setTimeout(start, 1000);
    }
    conn.on("error", function (err) {
      if (err.message !== "Connection closing") {
        console.error("[AMQP] conn error", err.message);
      }
    });
    conn.on("close", function () {
      console.error("[AMQP] reconnecting");
      return setTimeout(start, 1000);
    });

    console.log("[AMQP] connected");

    whenConnected(conn);
  });
}


setInterval(function () {
  publisher.publish("", consumer.queue, new Buffer("work at: " + new Date().toISOString()));
}, 1000);

// TODO might be better to also reconnect DB
// Connect to Mongo on start
// db.connect('mongodb://localhost:27017/mydatabase', function(err) {
db.connect(process.env.MONGO_BASE_URL + '/mydatabase', function (err) {
  if (err) {
    console.error('[Mongo] Unable to connect. Shutting down this node app.');
    process.exit(1);
  } else {
    start();
  }
});