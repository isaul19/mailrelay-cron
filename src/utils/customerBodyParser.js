const {
  GROUPS,
  FIELDS,
  FIELD_OPTIONS,
  ECONOMIC_ACTIVITY,
} = require("../global/constants");

const {
  selectTypeOperation,
  selectBanks,
} = require("../utils/operationFunctions");
const { selectActivity } = require("../utils/selectActivity");
const { dateToString } = require("./dateToString");

const customerBodyParser = (user) => {
  const {
    SIN_OPERACION_PJ,
    CON_OPERACION_PJ,
    CON_OPERACION_PN,
    SIN_OPERACION_PN,
    GENERAL,
  } = GROUPS;
  const {
    CELULAR,
    RAZON_SOCIAL,
    ACTIVIDAD_ECONOMICA,
    INICIO_ACTIVIDADES,
    TIPO_USUARIO,
    APELLIDO_PATERNO,
    APELLIDO_MATERNO,
    TARIFA_ESPECIAL,
    BANCO_DESTINO,
    BANCO_ORIGEN,
    ULTIMA_OPERACION,
    PRIMERA_OPERACION,
    TIPO_OPERACION,
  } = FIELDS;

  const {
    level,
    email,
    department,
    cellphone,
    special_service,
    lname_p,
    lname_m,
    name,
    type_operation,
    content_promo,
  } = user;

  const body = {
    status: "active",
    email: email.toLowerCase(),
    city: department,
  };
  const group_ids = [];
  const custom_fields = {};

  // celular
  custom_fields[`${CELULAR}`] = cellphone;

  switch (level) {
    case "30":
      // tipo de usuario
      custom_fields[`${TIPO_USUARIO}`] = Object.values(
        FIELD_OPTIONS[TIPO_USUARIO][0]
      )[0];

      //nombre
      body.name = name.toUpperCase().trim();

      // nacimiento
      if (user.birth_activity) {
        body.birthday = dateToString(user.birth_activity, false);
      }
      // apellidos paterno
      custom_fields[`${APELLIDO_PATERNO}`] = lname_p.toUpperCase().trim();

      // apellido materno
      custom_fields[`${APELLIDO_MATERNO}`] = lname_m.toUpperCase().trim();

      if (type_operation.length > 0) {
        group_ids.push(GENERAL, CON_OPERACION_PN);

        //TARIFA ESPECIAL
        custom_fields[`${TARIFA_ESPECIAL}`] = assignSpecial(special_service);

        // BANCO DESTINO
        custom_fields[`${BANCO_DESTINO}`] = selectBanks(
          FIELD_OPTIONS[BANCO_DESTINO],
          user.destiny_bank
        );

        // BANCO ORIGEN
        custom_fields[`${BANCO_ORIGEN}`] = selectBanks(
          FIELD_OPTIONS[BANCO_ORIGEN],
          user.origin_bank
        );

        // TIPO DE OPERACION
        custom_fields[`${TIPO_OPERACION}`] = selectTypeOperation(
          FIELD_OPTIONS[TIPO_OPERACION],
          user.type_operation
        );

        // ULTIMA OPERACION
        custom_fields[`${ULTIMA_OPERACION}`] = dateToString(
          user.last_operation
        );
        // PRIMERA OPERACION
        custom_fields[`${PRIMERA_OPERACION}`] = dateToString(
          user.first_operation
        );
      } else {
        group_ids.push(GENERAL, SIN_OPERACION_PN);
      }

      break;
    case "31":
      custom_fields[`${RAZON_SOCIAL}`] = user.commercial_name
        .toUpperCase()
        .trim();

      custom_fields[`${TIPO_USUARIO}`] = Object.values(
        FIELD_OPTIONS[TIPO_USUARIO][1]
      )[0];

      if (user.birth_activity) {
        custom_fields[`${INICIO_ACTIVIDADES}`] = dateToString(
          user.birth_activity, false
        );
      }

      if (
        user.economic_activity &&
        user.economic_activity.split("-").length > 1
      ) {
        custom_fields[`${ACTIVIDAD_ECONOMICA}`] = selectActivity(
          user.economic_activity.split("-")[1].trim(),
          FIELD_OPTIONS[`${ACTIVIDAD_ECONOMICA}`],
          ECONOMIC_ACTIVITY
        );
      }

      if (type_operation.length > 0) {
        group_ids.push(GENERAL, CON_OPERACION_PJ);
        //TARIFA ESPECIAL
        custom_fields[`${TARIFA_ESPECIAL}`] = assignSpecial(special_service);

        // BANCO DESTINO
        custom_fields[`${BANCO_DESTINO}`] = selectBanks(
          FIELD_OPTIONS[BANCO_DESTINO],
          user.destiny_bank
        );

        // BANCO ORIGEN
        custom_fields[`${BANCO_ORIGEN}`] = selectBanks(
          FIELD_OPTIONS[BANCO_ORIGEN],
          user.origin_bank
        );

        // TIPO DE OPERACION
        custom_fields[`${TIPO_OPERACION}`] = selectTypeOperation(
          FIELD_OPTIONS[TIPO_OPERACION],
          user.type_operation
        );

        // ULTIMA OPERACION
        custom_fields[`${ULTIMA_OPERACION}`] = dateToString(
          user.last_operation
        );

        // PRIMERA OPERACION
        custom_fields[`${PRIMERA_OPERACION}`] = dateToString(
          user.first_operation
        );
      } else {
        group_ids.push(GENERAL, SIN_OPERACION_PJ);
      }

      break;
  }

  return [
    content_promo,
    {
      ...body,
      custom_fields,
      group_ids,
    },
  ];
};

const assignSpecial = (special_service) => {
  special_service = special_service ? special_service : [];
  const assignValue = Object.values(special_service).some((val) => val !== 0);

  if (Object.values(special_service).length > 0 && assignValue) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  customerBodyParser,
};
