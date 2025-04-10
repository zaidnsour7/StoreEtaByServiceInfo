import AWS from 'aws-sdk';
const s3 = new AWS.S3();


export const storeEtaByServiceInfoHandler = async (event) => {
  try {
    const body = JSON.parse(event.body); 
    const etaArray = body.eta;
    const bucketName = process.env.S3_BUCKET_NAME;

    for (const etaRecord of etaArray) {
      const serviceName = etaRecord.service.service; 
      const timestamp = Date.now();
      const fileKey = `etaByServiceInfo/${serviceName}-${timestamp}.json`;
      const fileContent = JSON.stringify(etaRecord, null, 2);

      const params = {
        Bucket: bucketName, 
        Key: fileKey, 
        Body: fileContent, 
        ContentType: 'application/json',
      };

      await s3.putObject(params).promise();
    };

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Data stored successfully in S3 Bucket`,
      }),
    };
  } catch (error) {
    console.error('Error storing data in S3:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to store data in S3',
        error: error.message,
      }),
    };
  }
};


// store entire array in file 

// export const storeEtaByServiceInfoHandler = async (event) => {
//   try {
//     const body = JSON.parse(event.body); 
//     const etaArray = body.eta;
//     const bucketName = process.env.S3_BUCKET_NAME;
//     const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
//     const fileKey = `etaByServiceInfo/${fileId}.json`;

//     let jsonObj = {};

//     etaArray.forEach((etaRecord, index) => {
//       const rowKey = `row${index + 1}`;
//       jsonObj[rowKey] =  etaRecord;
//     });

//     const fileContent = JSON.stringify(jsonObj, null, 2);

//     const params = {
//       Bucket: bucketName, 
//       Key: fileKey, 
//       Body: fileContent, 
//       ContentType: 'application/json', 
//     };
    
//     await s3.putObject(params).promise();

//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         message: `Data stored successfully in S3: ${fileKey}`,
//       }),
//     };
//   } catch (error) {
//     console.error('Error storing data in S3:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         message: 'Failed to store data in S3',
//         error: error.message,
//       }),
//     };
//   }
// };








  