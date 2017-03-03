exports.closeOnErr = function (err, amqpConn) {
  if (!err) return false;
  console.error("[AMQP] error", err);
  amqpConn.close();
  return true;
}