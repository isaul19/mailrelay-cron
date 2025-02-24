const selectActivity = (codeCIIU, OPTIONS, ECONOMIC_ACTIVITY) => {
  const element = codeCIIU.substr(0, 2);
  const res = ECONOMIC_ACTIVITY.filter((item) => {
    const section = Object.values(item);
    return section[0].includes(element);
  })[0];
  const compareValue = res ? Object.keys(res)[0] : "";

  const sectionCode = OPTIONS.filter(
    (val) => Object.keys(val)[0] === compareValue
  )[0];

  const result = sectionCode ? Object.values(sectionCode)[0] : "";

  return result;
};

module.exports = {
  selectActivity,
};
