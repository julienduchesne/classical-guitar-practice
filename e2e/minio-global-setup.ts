import {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const BUCKET = "guitar-practice-test";

function makeClient() {
  return new S3Client({
    endpoint: "http://localhost:9000",
    region: "us-east-1",
    credentials: { accessKeyId: "minioadmin", secretAccessKey: "minioadmin" },
    forcePathStyle: true,
  });
}

export async function ensureBucket() {
  const s3 = makeClient();
  try {
    await s3.send(new HeadBucketCommand({ Bucket: BUCKET }));
  } catch {
    await s3.send(new CreateBucketCommand({ Bucket: BUCKET }));
  }
}

export async function clearSessions() {
  const s3 = makeClient();
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: "data/playtime-sessions.json",
      })
    );
  } catch {
    // ignore – file may not exist
  }
}

export default async function globalSetup() {
  await ensureBucket();
  await clearSessions();
}
