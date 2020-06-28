const listEndpoints = require("express-list-endpoints");
const app = require("../../server");
import { it } from "@jest/globals";
// console.log(listEndpoints(app));

const findEndpoint = (path, method) => {
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

export const skipIfNotFound = (path, method) => {
  if (!findEndpoint(path, method)) {
    return it.only("Skipping test. This route has not been implemented yet!", () => {
      // do nothing
    });
  }
};
