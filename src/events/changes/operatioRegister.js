const { operationSigned } = require("../../controllers/operationController");

const operationChangeFunction = async (user) => {
  try {
    await operationSigned(user);

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        message: "operationSigned successfullys",
      }),
    };
  } catch (error) {
    console.log(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        message: "Error in operationChangeFunction",
      }),
    };
  }
};

exports.operationChangeFunction = operationChangeFunction;
