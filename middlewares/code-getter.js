import request from 'request';

export default (req, res, next) => {
  if (req.ctx.code_url) {
    request({
      url: req.ctx.code_url,
      method: 'GET',
      content_type: 'text/plain',
    }, function(err, response, body) {
      if (err) {
        return next(err);
      }
      req.code = body;
      next();
    })
  } else {
    req.code = req.body;
    next();
  }


};
