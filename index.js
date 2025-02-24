const { connectDB } = require("./src/db/connect");
const { User } = require("./src/db/models/UsersMailrelay");
const { operationChangeFunction } = require("./src/events/changes/operatioRegister");
const { userChangeFunction } = require("./src/events/changes/userRegister");

const handler = async (event, context) => {
  await connectDB();

  const users = await User.find({ status_trigger: "PENDING" });

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

    user.status_trigger = "COMPLETED";
    await user.save();
  }
};

handler();
