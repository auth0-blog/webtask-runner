import _ from 'lodash';
import encryption from '../lib/encryption'

let parseUser = (user) => {
  let userCtx = _.extend({}, _.extend({code_url: user.code_url}, user.pctx));
  if (user.ectx) {
    _.extend(userCtx, encryption.decrypt(user.ectx));
  }
  return userCtx;
}

export default (req, res, next) => {
  let userCtx = {};
  if (req.user && process.env.USE_JWT) {
    userCtx = parseUser(req.user);
  }
  req.ctx = _.extend({}, req.query, userCtx);
  next();
}
