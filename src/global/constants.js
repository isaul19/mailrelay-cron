module.exports = {
  FIELDS: {
    APELLIDO_PATERNO: "2",
    APELLIDO_MATERNO: "3",
    TIPO_USUARIO: "9",
    RAZON_SOCIAL: "10",
    ULTIMA_OPERACION: "24",
    PRIMERA_OPERACION: "22",
    TIPO_OPERACION: "12",
    BANCO_ORIGEN: "13",
    BANCO_DESTINO: "14",
    DATOS_COMPLETOS: "15",
    TARIFA_ESPECIAL: "16",
    INICIO_ACTIVIDADES: "17",
    ACTIVIDAD_ECONOMICA: "20",
    CELULAR: "19",
  },
  FIELD_OPTIONS: {
    9: [
      {
        PERSONA_NATURAL: "1",
      },
      {
        PERSONA_JURIDICA: "2",
      },
    ],
    12: [
      {
        V: "4",
      },
      {
        C: "5",
      },
      {
        VC: "3",
      },
    ],
    13: [
      {
        BCP: "6",
      },
      {
        IBK: "7",
      },
      {
        BCP_I: "8",
      },
    ],
    14: [
      {
        BCP: "9",
      },
      {
        IBK: "10",
      },
      {
        BCP_I: "11",
      },
    ],
    20: [
      {
        A: "12",
      },

      {
        B: "13",
      },
      {
        C: "14",
      },
      {
        D: "15",
      },
      {
        E: "16",
      },
      {
        F: "17",
      },
      {
        G: "18",
      },
      {
        H: "19",
      },
      {
        I: "20",
      },
      {
        J: "21",
      },
      {
        K: "22",
      },
      {
        L: "23",
      },
      {
        M: "24",
      },
      {
        N: "25",
      },
      {
        O: "26",
      },
      {
        P: "27",
      },
      {
        Q: "28",
      },
      {
        R: "29",
      },
      {
        S: "30",
      },
      {
        T: "31",
      },
      {
        U: "32",
      },
    ],
  },
  ECONOMIC_ACTIVITY: [
    {
      A: ["01", "02", "03"],
    },

    {
      B: ["05", "06", "07", "08", "09"],
    },
    {
      C: [
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "33",
      ],
    },
    {
      D: ["35"],
    },
    {
      E: ["36", "37", "38", "39"],
    },
    {
      F: ["41", "42", "43"],
    },
    {
      G: ["45", "46", "47"],
    },
    {
      H: ["49", "50", "51", "52", "53"],
    },
    {
      I: ["55", "56"],
    },
    {
      J: ["58", "59", "60", "61", "62", "63"],
    },
    {
      K: ["64", "65", "66"],
    },
    {
      L: ["68"],
    },
    {
      M: ["69", "70", "71", "72", "73", "74", "75"],
    },
    {
      N: ["77", "78", "79", "80", "81", "82"],
    },
    {
      O: ["84"],
    },
    {
      P: ["85"],
    },
    {
      Q: ["86", "87", "88"],
    },
    {
      R: ["90", "91", "92", "93"],
    },
    {
      S: ["94", "95", "96"],
    },
    {
      T: ["97", "98"],
    },
    {
      U: ["99"],
    },
  ],
  MODEL_PN: ["name", "lname_p", "lname_m", "email", "nacimiento", "department", "cellphone"],
  MODEL_PJ: [
    "company_name",
    "email",
    "economic_activity",
    "department",
    "constitucion",
    "cellphone",
  ],
  MODEL_OPERATION: ["action", "destiny_bank", "origin_bank", "special_service", "created_at"],
  LEVELS: {
    PERSONA_JURIDICA: "31",
    PERSONA_NATURAL: "30",
    PERSONA_JURIDICA_USUARIO: "32",
  },
  OP_STATUS: {
    SIGNED: "4",
  },
  ACTION_EVENT: {
    UPDATE: "update",
    INSERT: "insert",
  },
  GROUPS: {
    SIN_OPERACION_PN: "6",
    SIN_OPERACION_PJ: "7",
    CON_OPERACION_PN: "4",
    CON_OPERACION_PJ: "5",
    GENERAL: "3",
  },
};
