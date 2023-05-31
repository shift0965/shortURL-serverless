const crypto = require("crypto");
const { DynamoDB } = require("aws-sdk");

function generateRandomString(length) {
  const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charactersLength);
    randomString += characters[randomIndex];
  }

  return randomString;
}

exports.handler = async (event) => {
  try {
    const originalURL = event.body;
    const dbClient = new DynamoDB.DocumentClient();

    const shortURL = generateRandomString(7);

    const params = {
      TableName: process.env.TABLE_NAME,
      Item: { originalURL, shortURL },
    };

    await dbClient.put(params).promise();

    return {
      statusCode: 200,
      body: shortURL,
    };
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error(error);
    return {
      statusCode: 500,
      body: error,
    };
  }
};
