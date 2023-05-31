#!/usr/bin/env node
const cdk = require('aws-cdk-lib');
const { ShortUrlServerlessStack } = require('../lib/short_url-serverless-stack');

const app = new cdk.App();
new ShortUrlServerlessStack(app, 'ShortUrlServerlessStack');
