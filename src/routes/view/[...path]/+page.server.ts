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

    const resp = await fetchList(parent, fetch);
    const data = await resp.json();

    const index = data.files.findIndex((e:any) => e.name == pathVal)

    return {
        current: pathVal,
        files: data.files,
    }
}