import AWS from 'aws-sdk';
const s3 = new AWS.S3();

export const storeEtaByServiceInfoHandler = async (event) => {
  try {
    const body = JSON.parse(event.body); 
    const eta = body.eta;
    const location = body.location;

    const serviceId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const bucketName = process.env.S3_BUCKET_NAME;
    const fileKey = `etaByServiceInfo/${serviceId}.json`;

    const fileContent = JSON.stringify({
      serviceId: serviceId,
      eta: eta,
      location: location,
      timestamp: new Date().toISOString(),
    });

    const params = {
      Bucket: bucketName, 
      Key: fileKey, 
      Body: fileContent, 
      ContentType: 'application/json', 
    };

    await s3.putObject(params).promise();

    console.log('Data stored successfully in S3:', { serviceId, eta, location });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Data stored successfully in S3',
        serviceId: serviceId,
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





  