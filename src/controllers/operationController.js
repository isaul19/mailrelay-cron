const { FIELDS, LEVELS, GROUPS } = require("../global/constants");
const { getSubscribers, patchSubscriber } = require("../global/mailrelayService");

const operationSigned = async (user) => {
  const custom_fields = {};
  const group_ids = [];

  const { BANCO_DESTINO, BANCO_ORIGEN, ULTIMA_OPERACION, PRIMERA_OPERACION, TIPO_OPERACION } =
    FIELDS;
  const { PERSONA_JURIDICA, PERSONA_JURIDICA_USUARIO } = LEVELS;
  const { CON_OPERACION_PJ, CON_OPERACION_PN, GENERAL } = GROUPS;

  let email = "";
  if (user.level === PERSONA_JURIDICA || user.level === PERSONA_JURIDICA_USUARIO) {
    email = user.company.email;
  } else {
    email = user.email;
  }

  const [subscriber] = await getSubscribers({
    "q[email_eq]": email,
  });

  custom_fields[`${BANCO_DESTINO}`] = selectBanks(
    FIELD_OPTIONS[BANCO_DESTINO],
    customer.destiny_bank
  );

  custom_fields[`${BANCO_ORIGEN}`] = selectBanks(FIELD_OPTIONS[BANCO_ORIGEN], customer.origin_bank);

  custom_fields[`${TIPO_OPERACION}`] = selectTypeOperation(
    FIELD_OPTIONS[TIPO_OPERACION],
    customer.type_operation
  );

  custom_fields[`${ULTIMA_OPERACION}`] = dateToString(customer.last_operation);
  custom_fields[`${PRIMERA_OPERACION}`] = dateToString(customer.first_operation);

  group_ids.push(GENERAL, customer.level === "30" ? CON_OPERACION_PN : CON_OPERACION_PJ);

  if (subscriber) {
    const beforeVariables = subscriber?.custom_fields ? subscriber.custom_fields : {};
    const currentVariables = { ...beforeVariables, ...custom_fields };

    if (!_.isEqual(currentVariables, beforeVariables))
      await patchSubscriber(subscriber.id, {
        custom_fields: currentVariables,
        group_ids,
      });
  }
};

const assignSpecialService = async (user) => {
  const { TARIFA_ESPECIAL } = FIELDS;
  const custom_fields = {};
  const { email } = user;
  const special_service = user?.special_service ? user.special_service : [];

  const [subscriber] = await getSubscribers({
    "q[email_eq]": email,
  });

  if (subscriber) {
    const assignValue = Object.values(special_service).some((val) => val !== 0);

    if (Object.values(special_service).length > 0 && assignValue) {
      custom_fields[`${TARIFA_ESPECIAL}`] = true;
    } else {
      custom_fields[`${TARIFA_ESPECIAL}`] = false;
    }

    await patchSubscriber(subscriber.id, {
      custom_fields: {
        ...subscriber.custom_fields,
        ...custom_fields,
      },
    });
  }
};

module.exports = { operationSigned, assignSpecialService };
