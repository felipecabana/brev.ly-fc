import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { randomUUID } from 'node:crypto'
import { desc } from 'drizzle-orm'

import { env } from '../config/env.js'
import { db } from '../db/connection.js'
import { links, type Link } from '../db/schema.js'

export class CdnNotConfiguredError extends Error {
  constructor() {
    super('CDN não configurada.')
    this.name = 'CdnNotConfiguredError'
  }
}

type CdnSettings = {
  accountId: string
  accessKeyId: string
  secretAccessKey: string
  bucket: string
  publicUrl: string
}

function getCdnSettings(): CdnSettings {
  const {
    CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_ACCESS_KEY_ID,
    CLOUDFLARE_SECRET_ACCESS_KEY,
    CLOUDFLARE_BUCKET,
    CLOUDFLARE_PUBLIC_URL,
  } = env

  if (
    !CLOUDFLARE_ACCOUNT_ID ||
    !CLOUDFLARE_ACCESS_KEY_ID ||
    !CLOUDFLARE_SECRET_ACCESS_KEY ||
    !CLOUDFLARE_BUCKET ||
    !CLOUDFLARE_PUBLIC_URL
  ) {
    throw new CdnNotConfiguredError()
  }

  return {
    accountId: CLOUDFLARE_ACCOUNT_ID,
    accessKeyId: CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: CLOUDFLARE_SECRET_ACCESS_KEY,
    bucket: CLOUDFLARE_BUCKET,
    publicUrl: CLOUDFLARE_PUBLIC_URL,
  }
}

function createS3Client({ accountId, accessKeyId, secretAccessKey }: CdnSettings) {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })
}

function buildPublicUrl(baseUrl: string, fileName: string) {
  return `${baseUrl.replace(/\/$/, '')}/${fileName}`
}

const CSV_HEADERS = ['originalUrl', 'shortUrl', 'accessCount', 'createdAt'] as const

function escapeCsvField(value: string | number): string {
  const text = String(value)

  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }

  return text
}

export async function fetchAllLinks(): Promise<Link[]> {
  return db.select().from(links).orderBy(desc(links.createdAt))
}

export function generateCsv(linkRows: Link[]): string {
  const header = CSV_HEADERS.join(',')
  const rows = linkRows.map((link) =>
    [
      escapeCsvField(link.originalUrl),
      escapeCsvField(link.shortUrl),
      escapeCsvField(link.accessCount),
      escapeCsvField(link.createdAt.toISOString()),
    ].join(','),
  )

  return [header, ...rows].join('\n')
}

export function createExportFileName() {
  return `${randomUUID()}-${String(Date.now())}.csv`
}

export async function uploadCsv({
  csvContent,
  fileName,
}: {
  csvContent: string
  fileName: string
}) {
  const cdn = getCdnSettings()
  const client = createS3Client(cdn)

  await client.send(
    new PutObjectCommand({
      Bucket: cdn.bucket,
      Key: fileName,
      Body: csvContent,
      ContentType: 'text/csv; charset=utf-8',
    }),
  )

  return {
    fileName,
    publicUrl: buildPublicUrl(cdn.publicUrl, fileName),
  }
}
