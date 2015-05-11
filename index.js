var Stripe42 = require('./lib/Stripe.js');
var Str = require('stripe');
var assert = require('assert');

module.exports = {
  factory: function factory (options) {
    assert(options.API_SECRET, 'API_SECRET is mandatory');
    var service = new Stripe42(options);

    //not writable, not enumarable
    Object.defineProperty(service, '_delegate', {
      value: Str(options.API_SECRET)
    });
    return service;
  },
  Stripe: Stripe42
};