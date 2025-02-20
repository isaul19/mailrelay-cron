const selectBanks = (banksOptions, clientBanks) => {
  return banksOptions
    .filter((value) => {
      const currentBank = Object.keys(value)[0];

      return currentBank !== "BCP_I"
        ? clientBanks.some((val) => val === currentBank)
        : clientBanks.some((val) => val !== "BCP" && val !== "IBK");
    })
    .map((element) => Object.values(element)[0]);
};

const selectTypeOperation = (operationOptions, clientOperations) => {
  const typeOperation = operationOptions.filter((item) => {
    const value = Object.keys(item)[0];
    return clientOperations.includes(value);
  });

  return typeOperation.length === 1
    ? Object.values(typeOperation[0])[0]
    : Object.values(operationOptions[2])[0];
};
module.exports = {
  selectTypeOperation,
  selectBanks,
};
