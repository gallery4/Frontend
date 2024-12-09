import { env } from "$env/dynamic/private";

export async function fetchList(
    path: string,
    fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
): Promise<Response> {
    
    const backendUrl = new URL('list', env.BACKEND_URL)
    var searchParams = backendUrl.searchParams
    searchParams.set('path', path);
    backendUrl.search = searchParams.toString();

    console.log(fetch)
    return fetch(backendUrl);
}