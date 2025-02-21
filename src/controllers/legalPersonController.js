const {
  FIELDS,
  FIELD_OPTIONS,
  GROUPS,
  ECONOMIC_ACTIVITY,
  MODEL_PJ,
} = require("../global/constants");
const { patchSubscriber, deleteSubscriber, postSubscriber } = require("../global/mailrelayService");

const { CELULAR, RAZON_SOCIAL, ACTIVIDAD_ECONOMICA, INICIO_ACTIVIDADES, TIPO_USUARIO } = FIELDS;

const insertLegalPerson = async () => {};

const updateLegalPerson = async (user) => {
  const body = {};
  const custom_fields = {};
  const { email } = user;
  const beforeChangeEmail = "";

  MODEL_PJ.forEach((key) => {
    const valueUpdate = updatedFields?.[`${key}`];

    if (valueUpdate && key === "commercial_name") {
      custom_fields[`${RAZON_SOCIAL}`] = valueUpdate.toUpperCase().trim();
    } else if (valueUpdate && key === "email") {
      body.email = valueUpdate.toLowerCase();
    } else if (valueUpdate && key === "economic_activity") {
      custom_fields[`${ACTIVIDAD_ECONOMICA}`] = selectActivity(
        valueUpdate.split("-")[1].trim(),
        FIELD_OPTIONS[`${ACTIVIDAD_ECONOMICA}`],
        ECONOMIC_ACTIVITY
      );
    } else if (valueUpdate && key === "constitucion") {
      custom_fields[`${INICIO_ACTIVIDADES}`] = dateToString(valueUpdate);
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

module.exports = { insertLegalPerson, updateLegalPerson };
