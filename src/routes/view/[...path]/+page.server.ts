import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, url }) => {
    const path = params.path;

    if (!path) {
        throw error(500, "path is required.")
    }

    const prefix = path.substring(0, path.lastIndexOf('/'))

    const backendUrl = new URL('list', env.BACKEND_URL)
    if (path != null) {
        backendUrl.search = `path=${prefix}`
    }

    const resp = await fetch(backendUrl);
    const data = await resp.json();

    const index = data.files.findIndex((e: string) => e == path)

    return {
        current: path,
        previous: index > 0 ? data.files[index - 1] : null,
        next: index < data.files.length - 2 ? data.files[index + 1] : null
    }
}