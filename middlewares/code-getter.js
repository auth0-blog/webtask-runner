export default (req, res, next) => {
  req.code = req.body;
  next();
};
