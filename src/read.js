/*
 * This script assumes permissions (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY) as environment variables or an IAM role
 */
// const https = require('https');
const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');
const isProduction = process.env.NODE_ENV === 'production';
const tmpDir = path.join(__dirname, '..', 'tmp');
const outputFile = 'topology.json';
const s3Config = {
  bucket: 'data.contributary.community',
  key: 'topology',
  object: outputFile
};

// expose handler for Lambda
exports.run = run;

if (!isProduction) {
  run();
}

// function uploadToS3(data) {
//   const s3 = new AWS.S3();
//   const key = `${s3Config.key}/${outputFile}`;

//   s3.createBucket({ Bucket: s3Config.bucket }, function(err) {

//     if (err) {
//       console.error(err); // eslint-disable-line no-console
//     } else {
//       const params = {
//         Bucket: s3Config.bucket,
//         Key: key,
//         Body: JSON.stringify(data, null, 2),
//         ACL: 'public-read'
//       };

//       s3.putObject(params, function(err) {
//         if (err) {
//           console.error(err); // eslint-disable-line no-console
//         } else {
//           console.log(`Successfully uploaded data to ${s3Config.bucket}/${key}`); // eslint-disable-line no-console
//         }
//       });
//     }
//   });
// } 

function writeToFilesystem(response) {
  const filePath = `${tmpDir}/${outputFile}`;

  fs.writeFileSync(`${filePath}`, JSON.stringify(response, null, 2), (err) => {
    if (err) {
      return console.error(err); // eslint-disable-line no-console
    }
    
    console.log(`File ${filePath} was saved!`); // eslint-disable-line no-console
  });
}

function handleGetTopologyResponse(response) {
  if (isProduction) {
    return response;
  } else {
    writeToFilesystem(response);
  }
}

function getTopology() {
  const s3 = new AWS.S3();

  return new Promise((resolve, reject) => {
    s3.getObject({
      Bucket: s3Config.bucket,
      Key: `${s3Config.key}/${s3Config.object}`
    }, (err, data) => {
      const parseedData = JSON.parse(data.Body.toString());

      if (err) {
        console.log(err); // eslint-disable-line
        reject();
      } else {
        resolve(parseedData);
      }
    });
  });
}

function run() {

  return getTopology()
    .then(handleGetTopologyResponse)
    .catch((err) => {
      console.log('caught error', err); // eslint-disable-line
    });

}