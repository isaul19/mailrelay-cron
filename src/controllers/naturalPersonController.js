const { MODEL_PN } = require("../global/constants");
const {
  postSubscriber,
  deleteSubscriber,
  patchSubscriber,
  getSubscribers,
} = require("../global/mailrelayService");

const { CELULAR, APELLIDO_PATERNO, APELLIDO_MATERNO, TIPO_USUARIO } = FIELDS;

const insertNaturalPerson = async () => {};

const updateNaturalPerson = async () => {
  const body = {};
  const custom_fields = {};
  const { email } = fullDocument;
  // WARNING no existe forma de saber el anterior email
  const beforeChangeEmail = "";

  MODEL_PN.forEach((key) => {
    const valueUpdate = updatedFields?.[`${key}`];

    if (valueUpdate && key === "name") {
      body.name = valueUpdate;
    } else if (valueUpdate && key === "lname_p") {
      custom_fields[`${APELLIDO_PATERNO}`] = valueUpdate.toUpperCase().trim();
    } else if (valueUpdate && key === "lname_m") {
      custom_fields[`${APELLIDO_MATERNO}`] = valueUpdate.toUpperCase().trim();
    } else if (valueUpdate && key === "email") {
      body.email = valueUpdate.toLowerCase();
    } else if (valueUpdate && key === "nacimiento") {
      body.birthday = dateToString(valueUpdate, false);
    } else if (valueUpdate && key === "department") {
      body.city = valueUpdate;
    } else if (valueUpdate && key === "cellphone") {
      custom_fields[`${CELULAR}`] = valueUpdate;
    }
  });

  if (Object.keys(body).length > 0 || Object.keys(custom_fields).length > 0) {
    const [subscriber] = await getSubscribers({
      "q[email_eq]": body?.email ? beforeChangeEmail : email,
      include_groups: true,
    });
    let patchBody = {};
    if (subscriber) {
      if (Object.keys(body).length > 0) {
        patchBody = { ...body };
      }
      if (Object.keys(custom_fields).length > 0) {
        patchBody = {
          ...patchBody,
          custom_fields: { ...subscriber.custom_fields, ...custom_fields },
        };
      }
      if (body?.email) {
        const group_ids = subscriber.groups.map(({ group_id }) => group_id);
        await Promise.all([
          postSubscriber({
            ...subscriber,
            group_ids,
            ...patchBody,
          }),
          deleteSubscriber(subscriber.id),
        ]);
      } else {
        await patchSubscriber(subscriber.id, patchBody);
      }
    }
  }
};

module.exports = { insertNaturalPerson, updateNaturalPerson };
