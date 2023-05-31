const { RestApi, LambdaIntegration } = require("aws-cdk-lib/aws-apigateway");
const { AttributeType, Table, BillingMode } = require("aws-cdk-lib/aws-dynamodb");
const { Function, Runtime, Code } = require("aws-cdk-lib/aws-lambda");
const { Stack, RemovalPolicy } = require("aws-cdk-lib");
class ShortUrlServerlessStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const dynamoTable = new Table(this, "shorturldb", {
      partitionKey: {
        name: "shortURL",
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
    this.dynamoTable = dynamoTable;

    // 2. Create an API to interact with our DB
    const api = new RestApi(this, "api");

    // Create url
    const createUrlLambda = new Function(this, "create-url-handler", {
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset("lambdas"),
      handler: "createUrl.handler",
      environment: {
        TABLE_NAME: dynamoTable.tableName,
      },
    });

    const getUrlLambda = new Function(this, "get-url-handler", {
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset("lambdas"),
      handler: "getUrl.handler",
      environment: {
        TABLE_NAME: dynamoTable.tableName,
      },
    });

    const deleteUrlLambda = new Function(this, "del-url-handler", {
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset("lambdas"),
      handler: "deleteUrl.handler",
      environment: {
        TABLE_NAME: dynamoTable.tableName,
      },
    });

    const urlCreate = api.root.addResource("urls");
    urlCreate.addMethod("POST", new LambdaIntegration(createUrlLambda));

    const urls = api.root.addResource("{shortURL}");
    urls.addMethod("GET", new LambdaIntegration(getUrlLambda));
    urls.addMethod("DELETE", new LambdaIntegration(deleteUrlLambda));

    dynamoTable.grantReadWriteData(createUrlLambda);
    dynamoTable.grantReadData(getUrlLambda);
    dynamoTable.grantFullAccess(deleteUrlLambda);
  }
}

module.exports = { ShortUrlServerlessStack };
