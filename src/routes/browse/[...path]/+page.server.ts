import {env} from '$env/dynamic/private';
import {BrowseClient} from '$lib/grpc/browse.client';
import {ChannelCredentials} from '@grpc/grpc-js';
import {GrpcTransport} from '@protobuf-ts/grpc-transport';

import type {PageServerLoad} from './$types';
import { decodePath } from '$lib/utils';

export const load: PageServerLoad = async ({params, url, fetch}) => {
  let transport = new GrpcTransport({
    host: env.BACKEND_URL ?? 'localhost:5026',
    channelCredentials: ChannelCredentials.createInsecure(),
  })

  let client = new BrowseClient(transport)
  const path = decodePath(params.path)

  console.log(path)

  let call = await client.list({path})

  return {
    request: call.request, response: call.response
  }
}