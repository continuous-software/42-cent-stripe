var BaseGateway = require('42-cent-base').BaseGateway;
var GatewayError = require('42-cent-base').GatewayError;
var util = require('util');
var mapKeys = require('42-cent-util').mapKeys;
var assign = require('object-assign');

var ccSchema = {
  creditCardNumber: 'number',
  expirationMonth: 'exp_month',
  expirationYear: 'exp_year',
  cvv2: 'cvc',
  cardHolder: 'name'
};

var prospectSchema = {
  billingAddress1: 'address_line1',
  billingAddress2: 'address_line2',
  billingCity: 'address_city',
  billingPostalCode: 'address_zip',
  billingState: 'address_state',
  billingCountry: 'address_country'
};


function Stripe42 (options) {
  BaseGateway.call(this, options);
}

util.inherits(Stripe42, BaseGateway);

function parseError (err) {
  err = err || {};
  throw new GatewayError(err.message || 'Remote error', err);
}

Stripe42.prototype.submitTransaction = function submitTransaction (order, creditCard, prospect, other) {
  var cardObject = mapKeys(creditCard, ccSchema, {object: 'card'});
  var prospectObject = mapKeys(prospect, prospectSchema);

  order.amount = Math.round(order.amount * 100); //convert to cents
  order.currency = order.currency || 'USD';

  order = assign(order, {source: assign(cardObject, prospectObject)}, other || {});

  return this._delegate.charges.create(order)
    .then(function (response) {
      return {
        transactionId: response.id,
        _original: response
      };
    })
    .catch(parseError);

};

Stripe42.prototype.authorizeTransaction = function authorizeTransaction (order, creditCard, prospect, other) {
  return this.submitTransaction(order, creditCard, prospect, assign(other || {}, {capture: false}));
};

Stripe42.prototype.refundTransaction = function refundTransaction (transactionId, options) {
  options = options || {};
  if (options.amount) {
    options.amount = Math.round(options.amount * 100);
  }
  return this._delegate.charges.createRefund(transactionId, options)
    .then(function (result) {
      return {
        _original: result
      };
    })
    .catch(parseError);
};

Stripe42.prototype.voidTransaction = function voidTransaction (transactionId, options) {
  return this.refundTransaction(transactionId, options);
};

Stripe42.prototype.createCustomerProfile = function createCustomerProfile (creditCard, billing, shipping, other) {
  var cardObject = mapKeys(creditCard, ccSchema, {object: 'card'});
  var prospectObject = mapKeys(billing, prospectSchema);
  var customer = {};

  if (billing.billingEmailAddress) {
    customer.email = billing.billingEmailAddress;
  }

  customer = assign(customer, {source: assign(cardObject, prospectObject)}, other || {});

  return this._delegate.customers.create(customer)
    .then(function (response) {
      return {
        profileId: response.id,
        _original: response
      };
    })
    .catch(parseError);

};

Stripe42.prototype.chargeCustomer = function chargeCustomer (order, prospect, other) {

  order.amount = Math.round(order.amount * 100); //convert to cents
  order.currency = order.currency || 'USD';
  order.customer = prospect.profileId;
  order = assign(order, other || {});

  return this._delegate.charges.create(order)
    .then(function (response) {
      return {
        transactionId: response.id,
        _original: response
      };
    })
    .catch(parseError);
};

module.exports = Stripe42;
