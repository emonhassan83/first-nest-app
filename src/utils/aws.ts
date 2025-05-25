import { S3 } from "aws-sdk";

interface UploadedImage {
    Bucket: string;
    Key: string;
    Location: string;
  }
  
  export async function uploadImages(files: Array<Express.Multer.File>) {
    return new Promise<UploadedImage[]>((resolve, reject) => {
      try {
        const s3 = new S3({
          accessKeyId: process.env.S3_BUCKET_ACCESS_KEY,
          secretAccessKey: process.env.S3_BUCKET_SECRET_ACCESS_KEY,
        });
  
        const images: UploadedImage[] = [];
  
        files.forEach(async (file) => {
          const filename = file.originalname;
  
          const params = {
            Bucket: `${process.env.AWS_BUCKET_NAME}/books`,
            Key: filename,
            Body: file.buffer,
          };
  
          const uploadResponse = await s3.upload(params).promise();
  
          images.push({
            Bucket: uploadResponse.Bucket,
            Key: uploadResponse.Key,
            Location: uploadResponse.Location,
          });
  
          if (images.length === files.length) resolve(images);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  