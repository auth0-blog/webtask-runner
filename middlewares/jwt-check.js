import jwt from 'express-jwt';
import expressIdentity from './express-identity'

let jwtCheck = jwt({
  secret: process.env.JWT_SECRET
});

export default (process.env.USE_JWT ? jwtCheck : expressIdentity);
