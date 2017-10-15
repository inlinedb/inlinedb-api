const {defineCaller} = require('./utils');

const alwaysTrue = () => true;

class Controller {

  constructor(methods, preConditions, stepInCondition = alwaysTrue) {
    this.methods = methods;
    this.preConditions = preConditions;
    this.stepInCondition = stepInCondition;
  }

  handle(request, response) {
    const call = defineCaller(request, response);

    return new Promise((resolve, reject) => {
      if (call(this.stepInCondition)) {
        const preConditionMessage = this.preConditions.reduce(
          (message, condition) => !message && call(condition.condition) ? condition.message : message,
          null
        );

        if (preConditionMessage) {
          return response.fail(preConditionMessage, 400, resolve);
        }

        const handler = this.methods[request.method.toLowerCase()];

        if (handler) {
          return call(handler, err => (err ? reject : resolve)());
        } else {
          return response.fail('', 400, resolve);
        }
      }
      return reject();
    });
  }

}

module.exports = {
  Controller
};
