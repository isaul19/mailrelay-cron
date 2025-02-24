const { MODEL_PN } = require("../global/constants");
const {
  postSubscriber,
  deleteSubscriber,
  patchSubscriber,
  getSubscribers,
} = require("../global/mailrelayService");
const {
  FIELDS,
  FIELD_OPTIONS,
  GROUPS,
} = require("../global/constants");
const { CELULAR, APELLIDO_PATERNO, APELLIDO_MATERNO, TIPO_USUARIO } = FIELDS;

const insertNaturalPerson = async (user) => {
  const { SIN_OPERACION_PN, GENERAL } = GROUPS;
  const {
    email,
    name,
    nacimiento,
    department,
    cellphone,
    lname_p,
    lname_m,
    content_promo,
  } = user;

  try {
    const body = {
      status: "active",
      email: email.toLowerCase(),
      name: name.toUpperCase().trim(),
      birthday: dateToString(nacimiento, false),
      city: department,
    };
    const group_ids = [];
    const custom_fields = {};

    // tipo de usuario
    custom_fields[`${TIPO_USUARIO}`] = Object.values(
      FIELD_OPTIONS[TIPO_USUARIO][0]
    )[0];

    // celular
    custom_fields[`${CELULAR}`] = cellphone;

    // apellidos paterno
    custom_fields[`${APELLIDO_PATERNO}`] = lname_p.toUpperCase().trim();

    // apellido materno
    custom_fields[`${APELLIDO_MATERNO}`] = lname_m.toUpperCase().trim();

    group_ids.push(GENERAL, SIN_OPERACION_PN);

    console.log(new Date(), "REGISTRO DE PERSONA NATURAL", {
      content_promo,
      ...body,
      custom_fields,
      group_ids,
    });

    const userSubscriber = await postSubscriber({
      ...body,
      custom_fields,
      group_ids,
    });

    if (!content_promo) {
      await deleteSubscriber(userSubscriber.id);
    }
  } catch (error) {
    console.log(
      new Date(),
      "ERROR CONTROLADOR REGISTRO DE PN:",
      error.response ? error.response : error
    );
    const msgAlert = console.log({
      process: "ERROR CONTROLADOR REGISTRO DE PN",
      error: error.response
        ? `${JSON.stringify(error.response.data)}, code: ${
            error.response.status
          }`
        : error,
    });  
  }
};

const updateNaturalPerson = async (user) => {
  const body = {};
  const custom_fields = {};
  const { email } = user;
  // WARNING no existe forma de saber el anterior email
  const beforeChangeEmail = "";

  MODEL_PN.forEach((key) => {
    const valueUpdate = user?.[`${key}`];

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
