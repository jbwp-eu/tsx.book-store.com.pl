import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const randomImageName = (bytes = 32): string =>
  crypto.randomBytes(bytes).toString("hex");

const {
  AWS_BUCKET_NAME_2,
  AWS_BUCKET_REGION_2,
  AWS_ACCESS_KEY_2,
  AWS_SECRET_KEY_2,
} = process.env;

const s3 = new S3Client({
  region: AWS_BUCKET_REGION_2,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_2 as string,
    secretAccessKey: AWS_SECRET_KEY_2 as string,
  },
});

const cloudFront = new CloudFrontClient({
  region: AWS_BUCKET_REGION_2,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_2 as string,
    secretAccessKey: AWS_SECRET_KEY_2 as string,
  },
});

export async function uploadFile(file: Express.Multer.File): Promise<string> {
  const imageName = "aws" + randomImageName();
  const params = {
    Bucket: AWS_BUCKET_NAME_2,
    Key: imageName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  const command = new PutObjectCommand(params);
  await s3.send(command);
  return imageName;
}

export async function getFile(imageName: string): Promise<string> {
  const params = {
    Bucket: AWS_BUCKET_NAME_2,
    Key: imageName,
  };
  const command = new GetObjectCommand(params);
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return url;
}

export async function deleteFile(imageName: string): Promise<void> {
  const invalidationParams = {
    DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
    InvalidationBatch: {
      CallerReference: imageName + Date.now(),
      Paths: { Quantity: 1, Items: ["/" + imageName] },
    },
  };
  const params = {
    Bucket: AWS_BUCKET_NAME_2,
    Key: imageName,
  };
  const command = new DeleteObjectCommand(params);
  await s3.send(command);
  const invalidationCommand = new CreateInvalidationCommand(invalidationParams);
  await cloudFront.send(invalidationCommand);
}
