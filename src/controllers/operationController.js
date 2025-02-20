const { FIELDS, LEVELS, GROUPS } = require("../global/constants");

const operationSigned = async () => {
  const custom_fields = {};
  const group_ids = [];

  const { BANCO_DESTINO, BANCO_ORIGEN, ULTIMA_OPERACION, PRIMERA_OPERACION, TIPO_OPERACION } =
    FIELDS;
  const { PERSONA_JURIDICA, PERSONA_JURIDICA_USUARIO } = LEVELS;
  const { CON_OPERACION_PJ, CON_OPERACION_PN, GENERAL } = GROUPS;
};

exports.operationSigned = operationSigned;
