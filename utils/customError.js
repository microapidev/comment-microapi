export default class CustomError extends Error {
  constructor(statusCode, message, data = []) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
