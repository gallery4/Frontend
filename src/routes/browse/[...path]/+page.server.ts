import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, fetch }) => {
    const path =  params.path

    const backendUrl = new URL('list', env.BACKEND_URL)
    if (path != null) {
        backendUrl.search = `path=${path}`
    }

    const resp = await fetch(backendUrl);

    const data = await resp.json();

    return data;
}