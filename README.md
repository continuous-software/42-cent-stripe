[![Build Status](https://travis-ci.org/continuous-software/42-cent-stripe.svg?branch=master)](https://travis-ci.org/continuous-software/42-cent-stripe) [![Greenkeeper badge](https://badges.greenkeeper.io/continuous-software/42-cent-stripe.svg)](https://greenkeeper.io/)

![42-cent-stripe](http://wiki.redcomponent.com/images/2/25/Stripe_logo_160.png)

## Installation ##

    $ npm install -s 42-cent-stripe

## Usage

```javascript
var Stripe = require('42-cent-stripe');
var client = new Stripe({
    API_SECRET: '<PLACEHOLDER>'
});
```

## Gateway API

This is an adaptor of [stripe-node](https://github.com/stripe/stripe-node) for [42-cent](https://github.com/continuous-software/42-cent).  
It implements the [BaseGateway](https://github.com/continuous-software/42-cent-base) API.
