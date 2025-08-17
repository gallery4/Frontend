
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, url, fetch }) => {
	redirect(307, "/browse")
}