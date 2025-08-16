import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import path from "path-browserify"
import { GrpcTransport } from "@protobuf-ts/grpc-transport";
import { env } from "$env/dynamic/private";
import { ChannelCredentials } from "@grpc/grpc-js";
import { BrowseClient } from "$lib/grpc/browse.client";

export const load: PageServerLoad = async ({ params, url }) => {
    const pathVal = params.path;

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

    const index = call.response.files.findIndex((e: any) => e.name == pathVal)

    return {
        current: pathVal,
        files: call.response.files,
    }
}