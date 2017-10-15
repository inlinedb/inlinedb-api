const {defineCaller} = require('./utils');
const status = require('http-status-codes');

const alwaysTrue = () => true;

class Controller {

  constructor(methods, preConditions, stepInCondition = alwaysTrue) {

    this.methods = methods;
    this.preConditions = preConditions;
    this.stepInCondition = stepInCondition;

  }

  stepIn(request, response, call, resolve, reject) {

    const preConditionMessage = this.preConditions.reduce(
      (message, condition) => !message && call(condition.condition) ? condition.message : message,
      null
    );

    if (preConditionMessage) {

      return response.fail(preConditionMessage, status.BAD_REQUEST, resolve);

    }

    const handler = this.methods[request.method.toLowerCase()];

    if (handler) {

      return call(handler, err => (err ? reject : resolve)());

    }

    return response.fail('', status.BAD_REQUEST, resolve);

  }

  handle(request, response) {

    const call = defineCaller(request, response);

    return new Promise((resolve, reject) => {

      if (call(this.stepInCondition)) {

        return this.stepIn(request, response, call, resolve, reject);

      }

      return reject();

    });

  }

}

module.exports = {
  Controller
};
