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
        return await userChangeFunction(user);
      case "operationSigned":
        return await operationChangeFunction(user);
    }

    user.status_trigger = "COMPLETED";
    await user.save();
  }
};

handler();
