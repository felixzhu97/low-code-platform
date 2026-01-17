/**
 * AWS type definitions
 */

export interface AWSOptions {
  region: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

export interface S3UploadOptions {
  bucket: string;
  key: string;
  body: string | Buffer;
  contentType?: string;
}
