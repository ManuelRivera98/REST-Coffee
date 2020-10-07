const numberToString = (value) => {
  const num = parseInt(value);
  if (num === NaN) return false;

  return num;
};

module.exports = {
  numberToString,
};