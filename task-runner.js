import express from 'express';
import StatusError from './errors/status-error'

// Middlewares
import jwtCheck from './middlewares/jwt-check'
import codeGetter from './middlewares/code-getter';
import contextCreator from './middlewares/context-creator'

// Imports for WebTasks
import request from 'request';

let app = express.Router();

app.post('/run', jwtCheck, contextCreator, codeGetter, (req, res) => {
  let clientCode = null;
  try {
    let factory = new Function('require', req.code);
    clientCode = factory(require);
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
      throw new StatusError(msg, 500);
  }

  let args = [];
  if (clientCode.length === 2) {
    args.push(req.ctx);
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
    throw new StatusError('Script generated an unhandled synchronous exception. ' + e.toString(), 500);
  }
});

export default app;



