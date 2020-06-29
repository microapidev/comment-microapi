const listEndpoints = require("express-list-endpoints");
const app = require("../../server");
import { it, describe } from "@jest/globals";
// console.log(listEndpoints(app));

const findEndpoint = (method, path) => {
  const endpoints = listEndpoints(app);

  // find path in array of objects
  return endpoints.some((endpoint) => {
    if (endpoint.path === path) {
      return endpoint.methods.some((currMethod) => {
        return method === currMethod;
      });
    }
  });
};

export const skipIfNotFound = (method, path) => {
  if (!findEndpoint(method, path)) {
    return it.only("Skipping all tests in file. This route has not been implemented yet!", () => {
      // do nothing
    });
  }
};

export const describeIfEndpoint = (method, path, name, callback) => {
  if (findEndpoint(method, path)) {
    return describe(name, callback);
  } else {
    return describe.skip(
      `Skipping "${name}" test. It has not been implemented yet!`,
      callback
    );
  }
};
