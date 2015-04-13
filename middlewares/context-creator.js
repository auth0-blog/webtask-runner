import _ from 'lodash';

// let parseUser = (user) => {
//   var userCtx = {};
//   if (user.ectx) {

//   }
// }

export default (req, res, next) => {
  // if (req.user && process.env.USE_JWT) {
  //   parseUser(req.user);
  // }
  var ctx = _.extend({}, req.query);
  req.ctx = ctx;
  next();
}
