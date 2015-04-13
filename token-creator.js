import express from 'express';
import jwtCheck from './middlewares/jwt-check';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import encryption from './lib/encryption'

let app = express.Router();

app.post('/create-token', jwtCheck, (req, res) => {
  let tokenBody = _.pick(req.user, 'sub', 'exp', 'aud', 'iat');

  if (req.body.ectx) {
    tokenBody.ectx = encryption.encrypt(req.body.ectx);
  }

  if (req.body.pctx) {
    tokenBody.pctx = req.body.pctx;
  }

  if (req.body.code_url) {
    tokenBody.code_url = req.body.code_url;
  }

  let returnJwt = jwt.sign(tokenBody, process.env.JWT_SECRET,
    { expiresInMinutes: 60 * 24 * 10, audience: process.env.JWT_AUDIENCE});

  res.status(201).json({
    id_token: returnJwt
  });
});

export default app;
