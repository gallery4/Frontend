import { env } from '$env/dynamic/private';

export async function GET({ url, fetch }) {
	const path = url.searchParams.get('path');

	const backendUrl = new URL('thumbnail', env.BACKEND_URL)
	if (path != null) {
		backendUrl.search = `path=${path}`
	}

	const data = await fetch(backendUrl)

	return data;
}