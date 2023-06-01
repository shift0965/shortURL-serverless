const { DynamoDB } = require("aws-sdk");
const dbClient = new DynamoDB.DocumentClient();

const corsSetting = {
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

exports.handler = async (event) => {
  try {
    // const deleteURL = JSON.parse(event.body).body;
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: {
        shortURL: event.pathParameters.shortURL,
      },
    };
    await dbClient.delete(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Successfully deleted!" }),
      headers: corsSetting,
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error" }),
      headers: corsSetting,
    };
  }
};
