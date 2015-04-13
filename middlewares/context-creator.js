import _ from 'lodash';

var contextFields = ['code_url']

export default (req, res, next) => {
  var ctx = _.extend({}, req.query, _.pick(req.user, contextFields));
  req.ctx = ctx;
  next();
}
