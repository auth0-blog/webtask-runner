export default class StatusError extends Error {
  constructor(msg, status) {
    super(msg);
    this.status = status;
    this.name = 'StatusError';
  }
}
