const { DynamoDB } = require("aws-sdk");
const dbClient = new DynamoDB.DocumentClient();

const corsSetting = {
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

exports.handler = async function (event) {
  try {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: {
        shortURL: event.pathParameters.shortURL,
      },
    };
    console.log(params);

    const data = await dbClient.get(params).promise();
    console.log(data);

    if (data.Item) {
      return {
        statusCode: 200,
        body: JSON.stringify({ originalURL: data.Item.originalURL }),
        headers: corsSetting,
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Item not found" }),
        headers: corsSetting,
      };
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error" }),
      headers: corsSetting,
    };
  }
};
