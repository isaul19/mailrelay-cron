const {
  postSubscriber,
  deleteSubscriber,
  patchSubscriber,
  getSubscribers,
  getDeletedSubscribers,
} = require("../global/mailrelayService");
const { User } = require("../db/models/UsersMailrelay");

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
  try {
    const {
      level,
      company,
      is_active: currentIsActive,
      is_active_fields,
      content_promo,
    } = user;

    let email;
    if (level === "30") {
      email = user.email;
    } else if (level === "31") {
      email = company.email;
    }

    if (email) {
      if (is_active_fields !== undefined) {
        await changeStatus(user, is_active_fields, email);
        if (is_active_fields) {
          await updateUser(user, email);
        }
      } else if (currentIsActive === true && content_promo !== undefined) {
        await changeStatus(user, content_promo, email);

        if (currentIsActive === true && content_promo) {
          await updateUser(user, email);
        }
      }
    }
  } catch (error) {
    console.log(
      new Date(),
      "ERROR CONTROLADOR CAMBIO DE ESTADO DE USUARIO:",
      error.response ? error.response : error
    );
    console.log({
      process: "ERROR CONTROLADOR CAMBIO DE ESTADO DE USUARIO",
      error: error.response
        ? `${JSON.stringify(error.response.data)}, code: ${
            error.response.status
          }`
        : error,
    });
  }
};

const changeStatus = async (fullDocument, statusValue, email) => {
  if (statusValue) {
    // EL USUARIO ESTA DESACTIVADO
    const [subscriber] = await getDeletedSubscribers({
      "q[email_eq]": email,
    });
    if (subscriber) {
      console.log(
        new Date(),
        "CAMBIO DE ESTADO DE SUBSCRIPTOR:",
        fullDocument,
        statusValue,
        subscriber
      );
      await restoreSubscriber(subscriber.id);
    }
  } else {
    // EL USUARIO ESTA ACTIVO
    const [subscriber] = await getSubscribers({
      "q[email_eq]": email,
    });

    if (subscriber) {
      console.log(
        new Date(),
        "CAMBIO DE ESTADO DE SUBSCRIPTOR:",
        fullDocument,
        statusValue,
        subscriber
      );
      await deleteSubscriber(subscriber.id);
    }
  }
};

const updateUser = async (fullDocument, email) => {
  const { _id } = fullDocument;

  const [[subscriber], [user]] = await Promise.all([
    getSubscribers({
      "q[email_eq]": email,
    }),
    User.aggregate([
      {
        $match: {
          _id,
        },
      },
      {
        $project: {
          level: 1,
          name: 1,
          lname_m: 1,
          lname_p: 1,
          content_promo: { $ifNull: ["$content_promo", true] },
          email: {
            $cond: [{ $eq: ["$level", "31"] }, "$company.email", "$email"],
          },
          birth_activity: {
            $ifNull: [
              {
                $cond: [
                  { $eq: ["$level", "31"] },
                  "$company.constitucion",
                  "$nacimiento",
                ],
              },
              null,
            ],
          },
          economic_activity: { $ifNull: ["$company.economic_activity", null] },
          cellphone: {
            $cond: [
              { $eq: ["$level", "31"] },
              "$company.cellphone",
              "$cellphone",
            ],
          },
          department: {
            $ifNull: [
              {
                $cond: [
                  { $eq: ["$level", "31"] },
                  "$company.department",
                  "$department",
                ],
              },
              null,
            ],
          },
          special_service: {
            $ifNull: [
              {
                $cond: [
                  { $in: ["$level", ["31"]] },
                  { $first: "$company.special_service" },
                  "$special_service",
                ],
              },
              null,
            ],
          },
          commercial_name: { $ifNull: ["$company.commercial_name", null] },
          type_operation: "$operation.action",
          origin_bank: "$operation.transac_contraparte.origin_bank",
          destiny_bank: "$operation.transac_contraparte.destiny_bank",
          last_operation: "$operation.updated_at",
          first_operation: "$operation.created_at",
        },
      },
    ]),
  ]);

  const [, customer] = customerBodyParser(user);

  console.log(new Date(), "bodyUpdate", {
    ...customer,
    custom_fields: {
      ...subscriber.custom_fields,
      ...customer.custom_fields,
    },
  });

  await patchSubscriber(subscriber.id, {
    ...customer,
    custom_fields: {
      ...subscriber.custom_fields,
      ...customer.custom_fields,
    },
  });
};

exports.changePersonStatus = changePersonStatus;
