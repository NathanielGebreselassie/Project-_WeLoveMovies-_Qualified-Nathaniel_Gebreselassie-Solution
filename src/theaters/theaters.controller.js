const theatersService = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//Returns a list of theaters.
const list = async (req, res, next) => {
  res.json({ data: await theatersService.list() });
};

module.exports = {
  list: asyncErrorBoundary(list),
};