import { env } from "$env/dynamic/private";

export async function fetchList(
    path: string,
    sortby: "name" | "dateTime",
    order: "ascending" | "descending",
    fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
): Promise<Response> {
    
    const backendUrl = new URL('list', env.BACKEND_URL)
    var searchParams = backendUrl.searchParams
    searchParams.set('path', path);
    searchParams.set('sortby', sortby);
    searchParams.set('order', order)
    backendUrl.search = searchParams.toString();

    return fetch(backendUrl);
}