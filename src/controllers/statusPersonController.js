const changePersonStatus = async (user) => {
  // const { level, company: companyId, is_active: currentIsActive } = user;
  // const { is_active, content_promo } = user;
  // let email;
  // if (level === "30") {
  //   email = fullDocument.email;
  // } else if (level === "31") {
  //   const company = await Company.findById(companyId, "email");
  //   email = company.email;
  // }
  // if (email) {
  //   if (is_active !== undefined) {
  //     await changeStatus(fullDocument, is_active, email);
  //     if (is_active) {
  //       await updateUser(fullDocument, email);
  //     }
  //   } else if (currentIsActive === true && content_promo !== undefined) {
  //     await changeStatus(fullDocument, content_promo, email);
  //     if (currentIsActive === true && content_promo) {
  //       await updateUser(fullDocument, email);
  //     }
  //   }
  // }
};

exports.changePersonStatus = changePersonStatus;
