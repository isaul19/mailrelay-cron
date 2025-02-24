const { connectDB } = require("./src/db/connect");
const { User } = require("./src/db/models/UsersMailrelay");
const { operationChangeFunction } = require("./src/events/changes/operatioRegister");
const { userChangeFunction } = require("./src/events/changes/userRegister");

const handler = async (event, context) => {
  await connectDB();

  const users = [
    {
      company: {
        commercial_name: "Tech Corp",
        cellphone: "999888777",
        constitucion: "2015-03-20T00:00:00.000Z",
        department: "Lima",
        economic_activity: "Technology",
        email: "user@user.com",
      },
      operation: {
        special_service: {
          sp_compra: 1500,
          sp_venta: 2000,
        },
        transac_contraparte: {
          origin_bank: "BCP",
          destiny_bank: "Interbank",
        },
        created_at: "2025-02-20T12:00:00.000Z",
        updated_at: "2025-02-20T12:30:00.000Z",
      },
      _id: "67b794a775b40eb87ed6a4a7",
      name: "saul",
      email: "saul@gmail.com",
      nacimiento: "1990-05-15T00:00:00.000Z",
      level: "30",
      lname_m: "porras",
      lname_p: "ayoque",
      cellphone: "987654321",
      department: "Lima",
      is_active: false,
      content_promo: false,
      trigger: "userRegister",
      status_trigger: "PENDING",
      created_at_trigger: "2025-02-20T20:46:31.929Z",
      updated_at_status_trigger: "2025-02-20T20:46:31.929Z",
      __v: 0,
    },
  ];

  if (users.length === 0) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        message: "Cron received success",
      }),
    };
  }

  for (const user of users) {
    switch (user.trigger) {
      case "companyUpdate":
      case "userRegister":
      case "userUpdate":
      case "userUpdatePromo":
        await userChangeFunction(user);
        break;
      case "operationSigned":
        await operationChangeFunction(user);
        break;
    }

    // user.status_trigger = "COMPLETED";
    // await user.save();
  }
};

handler();
