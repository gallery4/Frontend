import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import path from "path-browserify"
import { decodePath } from "$lib/utils";

export const load: PageLoad = async ({ params, url }) => {
    const pathVal = decodePath(params.path);

    if (!pathVal) {
        throw error(500, "path is required.")
    }

    const parent = path.dirname(pathVal)

    const mediaURL = new URL('/api/get', url.origin);
    mediaURL.searchParams.set('path', decodePath(pathVal));

    return {
        filename: path.basename(pathVal),
        parent: parent,
        mediaURL: mediaURL.toString()
    }
}