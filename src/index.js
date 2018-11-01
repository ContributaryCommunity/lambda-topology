/*
 * This script assumes AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are exported as environment variables
 */
const https = require('https');
const path = require('path');
const AWS = require('aws-sdk');
const fs = require('fs');
const topologyUrl = 'https://raw.githubusercontent.com/ContributaryCommunity/topology/master/data/topology.json';
const isProduction = process.env.NODE_ENV === 'production';
const tmpDir = path.join(__dirname, '..', 'tmp');
const outputFile = 'topology.json';
const s3Config = {
  bucket: 'data.contributary.community',
  key: 'topology'
};

// expose handler for Lambda
exports.run = run;

if (!isProduction) {
  run();
}

function uploadToS3(data) {
  const s3 = new AWS.S3();
  const key = `${s3Config.key}/${outputFile}`;

  s3.createBucket({ Bucket: s3Config.bucket }, function(err) {

    if (err) {
      handleError(err);
    } else {
      const params = {
        Bucket: s3Config.bucket,
        Key: key,
        Body: JSON.stringify(data, null, 2),
        ACL: 'public-read'
      };

      s3.putObject(params, function(err) {
        if (err) {
          console.error(err); // eslint-disable-line no-console
        } else {
          console.log(`Successfully uploaded data to ${s3Config.bucket}/${key}`); // eslint-disable-line no-console
        }
      });
    }
  });
} 

function writeToFilesystem(response) {
  const filePath = `${tmpDir}/${outputFile}`;

  fs.writeFileSync(`${filePath}`, JSON.stringify(response, null, 2), (err) => {
    if (err) {
      return console.error(err); // eslint-disable-line no-console
    }
    
    console.log(`File ${filePath} was saved!`); // eslint-disable-line no-console
  });
}

function handleIngestionResponse(response) {
  if (isProduction) {
    uploadToS3(response);
  } else {
    writeToFilesystem(response);
  }
}

function ingestTopology() {
  return new Promise((resolve, reject) => {
    https.get(topologyUrl, (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        resolve(JSON.parse(data));
      });

    }).on('error', (err) => {
      reject(() => {
        console.error(err); // eslint-disable-line no-console
      });
    });
  });
}

function run() {

  ingestTopology()
    .then(handleIngestionResponse);

}