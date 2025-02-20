const handler = async (event, context) => {
  console.log("Hello World from AWS Lambda 🚀");

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello World from AWS Lambda 🚀",
    }),
  };
};

handler();
