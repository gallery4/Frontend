import { fetchList } from "$lib/server";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, url, fetch }) => {
    const path = params.path
    const sortby: "name" | "dateTime" 
        = url.searchParams.get("sortby") != 'dateTime' ? 'name' : 'dateTime'
    const order: "ascending" | "descending" 
        = url.searchParams.get("order") != 'descending' ? 'ascending' : 'descending'

    const resp = await fetchList(path, sortby, order, fetch);
    const data = await resp.json();

    return {
        path: data.path,
        directories: data.directories,
        archives: data.archives,
        files: data.files,
    };
}