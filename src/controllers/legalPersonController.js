const {
  FIELDS,
  FIELD_OPTIONS,
  GROUPS,
  ECONOMIC_ACTIVITY,
  MODEL_PJ,
} = require("../global/constants");
const {
  patchSubscriber,
  deleteSubscriber,
  postSubscriber,
} = require("../global/mailrelayService");

const {
  CELULAR,
  RAZON_SOCIAL,
  ACTIVIDAD_ECONOMICA,
  INICIO_ACTIVIDADES,
  TIPO_USUARIO,
} = FIELDS;

const insertLegalPerson = async (user) => {
  const { SIN_OPERACION_PJ, GENERAL } = GROUPS;
  const { content_promo, company } = user;

  try {
    if (!company) {
      throw new Error("No se encontró información de la empresa");
    }

    const body = {
      status: "active",
      email: company.email?.toLowerCase(),
      city: company.department,
    };

    const group_ids = [];
    const custom_fields = {};

    custom_fields[`${TIPO_USUARIO}`] = Object.values(
      FIELD_OPTIONS[TIPO_USUARIO][1]
    )[0];

    custom_fields[`${RAZON_SOCIAL}`] = company.commercial_name
      .toUpperCase()
      .trim();

    custom_fields[`${INICIO_ACTIVIDADES}`] = dateToString(company.constitucion);
    custom_fields[`${CELULAR}`] = company.cellphone;

    custom_fields[`${ACTIVIDAD_ECONOMICA}`] = selectActivity(
      company.economic_activity.split("-")[1].trim(),
      FIELD_OPTIONS[`${ACTIVIDAD_ECONOMICA}`],
      ECONOMIC_ACTIVITY
    );

    group_ids.push(GENERAL, SIN_OPERACION_PJ); //agregandodos valores al array

    console.log(new Date(), "REGISTRO DE PERSONA JURIDICA", {
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
      await deleteSubscriber(userSubscriber.id); // Si content_promo es false, elimina el suscriptor (deleteSubscriber).
    }
  } catch (error) {
    // RECUPERAMOS EL ERROR DENTRO DEL REGISTRO DE UNA PERSONA JURIDICA
    console.log(
      new Date(),
      "ERROR CONTROLADOR REGISTRO DE PJ:",
      error.response ? error.response : error
    );
    console.log({
      process: "ERROR CONTROLADOR REGISTRO DE PJ",
      error: error.response
        ? `${JSON.stringify(error.response.data)}, code: ${
            error.response.status
          }`
        : error,
    });
  }
};

const updateLegalPerson = async (user) => {
  const body = {};
  const custom_fields = {};
  const { email } = user;
  // WARNING no existe forma de saber el anterior email
  const beforeChangeEmail = "";

  MODEL_PJ.forEach((key) => {
    const valueUpdate = user?.[`${key}`];

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
