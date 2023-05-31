const { RestApi, LambdaIntegration } = require("aws-cdk-lib/aws-apigateway");
const { AttributeType, Table, BillingMode } = require("aws-cdk-lib/aws-dynamodb");
const { Function, Runtime, Code } = require("aws-cdk-lib/aws-lambda");
const { Stack, RemovalPolicy } = require("aws-cdk-lib");
class ShortUrlServerlessStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const dynamoTable = new Table(this, "shorturldb", {
      partitionKey: {
        name: "originalURL",
        type: AttributeType.STRING,
      },
      // sortKey: {
      //   name: "shortURL",
      //   type: AttributeType.STRING,
      // },
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
    this.dynamoTable = dynamoTable;

    // 2. Create an API to interact with our DB
    const api = new RestApi(this, "api");

    // Create url
    const createUrlLambda = new Function(this, "create-url-handler", {
      runtime: Runtime.NODEJS_16_X, // execution environment
      code: Code.fromAsset("lambdas"),
      handler: "createUrl.handler",
      environment: {
        TABLE_NAME: dynamoTable.tableName,
      },
    });

    // 4. Add routes
    const urls = api.root.addResource("urls");
    urls.addMethod("POST", new LambdaIntegration(createUrlLambda));

    // // 5. Grant specific permissions to each lambda
    dynamoTable.grantReadWriteData(createUrlLambda);
  }
}

module.exports = { ShortUrlServerlessStack };
