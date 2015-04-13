export default (req, res, next) => {
  req.ctx = {};
  next();
}
