import express from 'express';
import _ from 'lodash';
import jwt from 'express-jwt';
import identityMiddleware from './express-identity-middleware'
import StatusError from './status-error'

let app = express.Router();

console.log(process.env.JWT_SECRET);
let jwtCheck = jwt({
  secret: process.env.JWT_SECRET
});

let checkIdentity = process.env.USE_JWT ? jwtCheck : identityMiddleware;

let getCode = (req, res, next) => {
  req.code = req.body;
  next();
};

let createContext = (req) => {
  return {};
};

app.post('/run', checkIdentity, getCode, (req, res) => {
  let clientCode = null;
  try {
    let factory = new Function(req.code);
    clientCode = factory();
    if (typeof clientCode !== 'function') {
        let msg = 'The code does not return a JavaScript function.';
        throw new StatusError(msg, 400);
    }
    if (clientCode.length === 0 || clientCode.length > 2) {
        let msg = 'The JavaScript function must have one of the following signature: (ctx, callback)';
        throw new StatusError(msg, 400);
    }
  } catch (e) {
      let msg = 'Unable to compile submitted JavaScript. ' + e.toString();
      throw new StatusError(msg, status);
  }

  let args = [];
  if (clientCode.length === 2) {
    args.push(createContext(req));
  }

  args.push((err, data) => {
    if (err) {
      throw new StatusError('Script returned error.', 400);
    }
    let returnBody = null;
    try {
      returnBody = data ? JSON.stringify(data): '{}';
    } catch (e) {
      throw new StatusError('Error when JSON serializing the result of the JavaScript code.', 400);
    }

    res.set('Content-Type', 'application/json').status(200).send(returnBody);
  });

  try {
    clientCode.apply(this, args);
  } catch(e) {
    throw new StatusError('Script generated an unhandled synchronous exception.', 500);
  }
});

export default app;



