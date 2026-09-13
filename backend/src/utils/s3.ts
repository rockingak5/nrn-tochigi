import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Credentials come from the standard AWS SDK v3 provider chain (env vars
// here, since `dotenv` loads AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY into
// process.env — never hardcode keys in code). Region and bucket are
// required config, checked lazily on first upload so `tsx watch` / a
// missing .env fails with a clear message instead of a cryptic SDK error.
let client: S3Client | undefined;

function getConfig() {
  const region = process.env.AWS_REGION;
  const bucket = process.env.AWS_S3_BUCKET;
  if (!region || !bucket) {
    throw new Error('AWS_REGION and AWS_S3_BUCKET must be set to upload files');
  }
  // Defaults to the bucket's public virtual-hosted-style URL. Set
  // AWS_S3_PUBLIC_BASE_URL instead (e.g. a CloudFront domain) to serve
  // uploads through a CDN without changing any upload code.
  // `||` (not `??`): an unset AWS_S3_PUBLIC_BASE_URL comes through as `""`
  // from a blank `.env` line, not `undefined`, so `??` would never fall
  // back to the default and every URL would end up hostless.
  const publicBaseUrl = (process.env.AWS_S3_PUBLIC_BASE_URL || `https://${bucket}.s3.${region}.amazonaws.com`).replace(
    /\/$/,
    '',
  );
  return { region, bucket, publicBaseUrl };
}

function getClient(region: string): S3Client {
  client ??= new S3Client({ region });
  return client;
}

export async function uploadFileToS3(params: {
  key: string;
  body: Buffer;
  contentType: string;
}): Promise<string> {
  const { region, bucket, publicBaseUrl } = getConfig();
  const s3 = getClient(region);

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
      // Bucket policy (not object ACLs — those are best avoided under
      // modern S3 defaults) grants public GetObject on this prefix; see
      // backend/README.md for the exact bucket policy/setup steps.
    }),
  );

  return `${publicBaseUrl}/${params.key}`;
}

// Matches against both the bucket's raw URL and the configured public base
// URL, since a record saved before AWS_S3_PUBLIC_BASE_URL was set (or
// changed, e.g. to a future CDN domain) may still hold the other form.
// Returns null for anything else (a pre-S3 local `/uploads/..` path, or an
// already-null field) — callers use that to skip deletion entirely.
function keyFromUrl(url: string, publicBaseUrl: string, bucket: string, region: string): string | null {
  const rawBucketUrl = `https://${bucket}.s3.${region}.amazonaws.com`;
  for (const base of [publicBaseUrl, rawBucketUrl]) {
    if (url.startsWith(`${base}/`)) {
      return url.slice(base.length + 1);
    }
  }
  return null;
}

// Best-effort: a failed cleanup (network blip, object already gone, missing
// DeleteObject permission) should never fail the update/delete request the
// caller is actually waiting on, so errors are logged, not thrown.
export async function deleteFileFromS3(url: string | null | undefined): Promise<void> {
  if (!url) return;

  try {
    const { region, bucket, publicBaseUrl } = getConfig();
    const key = keyFromUrl(url, publicBaseUrl, bucket, region);
    if (!key) return;

    const s3 = getClient(region);
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  } catch (err) {
    console.error('Failed to delete old S3 object for url:', url, err);
  }
}

// Callers pass the pre-update and post-update value of the *same instance
// field* (e.g. `oldImageUrl` captured before `item.update()`, and
// `item.imageUrl` read back after it) — never the raw request body value.
// Sequelize's `instance.update()` drops any key whose value is `undefined`
// (omitted from the request) before persisting, so comparing against the
// request body directly would treat "field not sent" the same as "field
// cleared" and delete a file the record still points at.
//
// Fire-and-forget: deleteFileFromS3 already catches its own errors and
// never rejects, so callers don't need to await a best-effort cleanup
// nobody reads the result of before sending their response.
export function cleanupReplacedImage(oldUrl: string | null | undefined, newUrl: string | null | undefined): void {
  if (oldUrl && oldUrl !== newUrl) {
    void deleteFileFromS3(oldUrl);
  }
}
