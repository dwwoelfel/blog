var makeRelayPlugin = require('babel-relay-plugin');
var schema = require('./schema.json');

module.exports = makeRelayPlugin(schema.data);
