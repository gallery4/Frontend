import { fetchList } from "$lib/server";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, url, fetch }) => {
    const path = params.path
    
    const resp = await fetchList(path, fetch);
    const data = await resp.json();

    return {
        path: data.path,
        directories: data.directories,
        archives: data.archives,
        files: data.files,
    };
}