const alwaysTrue = () => true;

class Controller {

  constructor(methods, preConditions) {
    this.methods = methods;
    this.preConditions = preConditions;
  }

  handle(request, response, stepInCondition = alwaysTrue) {
    return new Promise((resolve, reject) => {
      if (stepInCondition()) {
        const preConditionMessage = this.preConditions.reduce(
          (message, condition) => !message && condition.condition() ? condition.message : message,
          null
        );

        if (preConditionMessage) {
          return response.fail(preConditionMessage, 400, resolve);
        }

        const handler = this.methods[request.method.toLowerCase()];

        if (handler) {
          return handler(err => (err ? reject : resolve)());
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
