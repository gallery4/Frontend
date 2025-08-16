import { env } from '$env/dynamic/private';
import { ChannelCredentials } from '@grpc/grpc-js';
import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import { DownloadClient } from '$lib/grpc/download.client';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
  let transport = new GrpcTransport({
    host: env.BACKEND_URL ?? 'localhost:5026',
    channelCredentials: ChannelCredentials.createInsecure(),
  })

  let client = new DownloadClient(transport)
  const url = new URL(request.url)
  let path = url.searchParams.get('path') ?? ''

  const stream = client.get({ path })

  let filename = ''
  let buffer = new ArrayBuffer(0, { maxByteLength: 4 * 1024 * 1024 * 1024 })

  for await (let message of stream.responses) {
    if (filename == '') {
      filename = message.filename
    }

    let offset = buffer.byteLength
    buffer.resize(buffer.byteLength + message.data.length)

    let array = new Uint8Array(buffer, offset, message.data.length)
    array.set(message.data)
  }

  return new Response(buffer, {
    headers: {
      'content-disposition':
        `attachment; filename="${encodeURIComponent(filename)}"`,
      'content-length': `${buffer.byteLength}`
    }
  })
};