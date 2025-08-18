import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import path from "path-browserify"
import { GrpcTransport } from "@protobuf-ts/grpc-transport";
import { env } from "$env/dynamic/private";
import { ChannelCredentials } from "@grpc/grpc-js";
import { BrowseClient } from "$lib/grpc/browse.client";
import { decodePath } from "$lib/utils";
import { createViewUrl } from "$lib/navigation";

export const load: PageServerLoad = async ({ params, url }) => {
    const pathVal = decodePath(params.path);

    if (!pathVal) {
        throw error(500, "path is required.")
    }

    const parent = path.dirname(pathVal)

    let transport = new GrpcTransport({
        host: env.BACKEND_URL ?? 'localhost:5026',
        channelCredentials: ChannelCredentials.createInsecure(),
    })

    let client = new BrowseClient(transport)

    const call = await client.list({
        path: parent
    })

    const files = call.response.files;

    const index = files.findIndex((e: any) => e.name == pathVal);
    const previous = index > 0 ? files[index - 1].name : null;
    const next = index < files.length - 1 ? files[index + 1].name : null;

    const nextURL = next == null ? null : createViewUrl(next, url.origin);
    const previousURL = previous == null ? null : createViewUrl(previous, url.origin);

    const mediaUrl = new URL('/api/get', url.origin);
    mediaUrl.searchParams.set('path', decodePath(pathVal));

    return {
        filename: path.basename(pathVal),
        parent,
        nextURL: nextURL?.toString(),
        previousURL: previousURL?.toString(),
        mediaUrl: mediaUrl.toString()
    }
}