const { DynamoDB } = require("aws-sdk");
const dbClient = new DynamoDB.DocumentClient();

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
        statusCode: 301,
        headers: { Location: data.Item.originalURL },
        // body: JSON.stringify({ originalURL: data.Item.originalURL }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Item not found" }),
      };
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error" }),
    };
  }
};
