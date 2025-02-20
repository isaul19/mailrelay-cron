const dateToString = (date, utc = true) => {
  if (utc) {
    return new Date(date.valueOf() - 10e4 * 36 * 5).toISOString().split("T")[0];
  }
  return new Date(date.valueOf()).toISOString().split("T")[0];
};

module.exports = {
  dateToString,
};
