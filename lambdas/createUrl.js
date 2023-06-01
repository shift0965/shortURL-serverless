const crypto = require("crypto");
const { DynamoDB } = require("aws-sdk");

function generateRandomString(length) {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charactersLength);
    randomString += characters[randomIndex];
  }

  return randomString;
}

const corsSetting = {
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

exports.handler = async (event) => {
  try {
    const originalURL = JSON.parse(event.body).body;
    const dbClient = new DynamoDB.DocumentClient();

    const shortURL = generateRandomString(7);

    const params = {
      TableName: process.env.TABLE_NAME ?? "",
      Item: { shortURL, originalURL },
    };

    await dbClient.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ shortURL: shortURL }),
      headers: corsSetting,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error }),
      headers: corsSetting,
    };
  }
};
