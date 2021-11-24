module.exports = function nestedToJson(result) {
  return JSON.parse(JSON.stringify(result));
};
