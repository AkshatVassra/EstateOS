// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class UploadService {
  static async getPresignedUrl(agencyId: string, filename: string, _contentType: string) {
    // const s3 = new S3Client({
    //   region: "auto",
    //   endpoint: process.env.R2_ENDPOINT,
    //   credentials: {
    //     accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    //     secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    //   },
    // });
    // 
    // const key = `${agencyId}/${Date.now()}-${filename}`;
    // 
    // const command = new PutObjectCommand({
    //   Bucket: process.env.R2_BUCKET_NAME,
    //   Key: key,
    //   ContentType: contentType,
    // });
    // 
    // const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    
    // MOCK FOR NOW:
    const key = `${agencyId}/${Date.now()}-${filename}`;
    const url = `https://mock-r2-url.com/presigned?key=${key}`;

    return { url, key };
  }
}
