# lambda-topology-ingest
[![GitHub release](https://img.shields.io/github/tag/ContributaryCommunity/lambda-topology-ingest.svg)](https://github.com/ContributaryCommunity/lambda-topology-ingest/tags)
![CircleCI branch](https://img.shields.io/circleci/project/github/ContributaryCommunity/lambda-topology-ingest/master.svg?style=plastic)
[![GitHub issues](https://img.shields.io/github/issues-raw/ContributaryCommunity/lambda-topology-ingest.svg)](https://github.com/ContributaryCommunity/lambda-topology-ingest/issues)
[![GitHub issues](https://img.shields.io/github/issues-pr-raw/ContributaryCommunity/lambda-topology-ingest.svg)](https://github.com/ContributaryCommunity/lambda-topology-ingest/issues)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/ContributaryCommunity/lambda-topology-ingest/master/LICENSE.md)

## Overview
Lambda for topology ingestion of the topology in GitHub to the [Contributary website](https://lambda-topology-ingest).  The Lambda is run on a cron to update topology once a day.

## Workflow
Changes submitted to _src/*.js_ are uploaded manually to the AWS Lambda function console.  Currently there are two Lambdas used
- _ingest_ - Copies _data/topology.json_ from GitHub once a day and copies it into an S3 bucket
- _read_ - Responds to _api/topology_ requests in API Gateway with the contents of the topology file in S3

## Development
For contributing to this project and testing the output locally, you will need
1. [NodeJS](https://nodejs.org/) 8.x
1. [Yarn](https://yarnpkg.com) 1.x
1. Create _tmp/_ directory in the root of the project

- `yarn lint` - Validatse all JS and JSON passes linting
- `yarn ingest` - Run _src/ingeest.js_ and by default output the file in _tmp/_
- `yarn read` - Run _src/read.js_ and by default output the file in _tmp/_

> With the appropriate AWS credentials exported locally, testing against the live endpoints can be done by running `export NODE_ENV=production` before the relevant task.

## Release Procedure
1. Merge all changes into master
1. Bump _package.json_, `git tag` and push everything to master
1. Upload the contents of _src/index.js_ to Lambda
1. Create [Release Notes](https://github.com/ContributaryCommunity/lambda-topology-ingest/releases) in GitHub