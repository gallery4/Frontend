import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import path from "path-browserify"
import { decodePath } from "$lib/utils";

export const load: PageLoad = async ({ params, url }) => {
    const pathVal = decodePath(params.path);

    if (!pathVal) {
        throw error(500, "path is required.")
    }

    const mediaUrl = new URL('/api/get', url.origin);
    mediaUrl.searchParams.set('path', decodePath(pathVal));

    return {
        filename: path.basename(pathVal),
        parent: path.dirname(pathVal),
        mediaUrl: mediaUrl.toString()
    }
}