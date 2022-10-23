module.exports = function (fn) {
  return async (req, req, next) => {
    fn().catch(next);
  }
};