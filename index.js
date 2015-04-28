var Stripe42 = require('./lib/Stripe.js');
var Str = require('stripe');
var assign = require('object-assign');

module.exports = {
  factory: function factory (apiSecret, options) {
    var service = new Stripe42(options);

    //not writable, not enumarable
    Object.defineProperty(service, '_delegate', {
      value: Str(apiSecret)
    });

    service = assign(service, options);
    return service
  },
  Stripe: Stripe42
};