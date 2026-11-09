const { finished } = require('node:stream/promises');

module.exports = (stream) => finished(stream, { cleanup: true }).then(() => stream);
