import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { fetchList } from "$lib/server";
import path from "path-browserify"

export const load: PageServerLoad = async ({ params, url }) => {
    const pathVal = params.path;

    if (!pathVal) {
        throw error(500, "path is required.")
    }

    const parent = path.dirname(pathVal)

    const sortby: "name" | "dateTime" 
        = url.searchParams.get("sortby") != 'dateTime' ? 'name' : 'dateTime'

    const order: "ascending" | "descending" 
        = url.searchParams.get("order") != 'descending' ? 'ascending' : 'descending'

    const resp = await fetchList(parent, sortby, order, fetch);
    const data = await resp.json();

    const index = data.files.findIndex((e:any) => e.name == pathVal)

    return {
        current: pathVal,
        previous: index > 0 ? data.files[index - 1].name : null,
        next: index < data.files.length - 2 ? data.files[index + 1].name : null,
        sortby: sortby,
        order: order,
    }
}