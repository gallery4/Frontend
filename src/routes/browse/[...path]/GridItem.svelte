<script lang="ts">
	import { page } from '$app/state';
	import { getIconColor, getIconImage, getIconName } from '$lib/icons';
	import { createElementId, determinFileType, getFilenameFromKey } from '$lib/utils';

	let { name, type } = $props();

	function getLink(): string {
		switch (type) {
			case 'file':
				return `/view/${name}`;

			case 'directory':
			case 'zip':
				return `/browse/${name}`;
		}

		return '';
	}

	function getImage(): string {
		if (type != 'file') return getIconImage(type, false);

		const filetype = determinFileType(name);
		if (filetype == 'image') {
			let url = new URL('/api/thumbnail', page.url.origin);
			url.searchParams.set('path', name);
			url.searchParams.set('type', 'GRID');

			return url.toString();
		}

		return getIconImage(type, filetype);
	}
</script>

<div class="card bg-base-100 h-full shadow-xl" id={createElementId(getFilenameFromKey(name, type))}>
	<div class="mb-0 mt-0">
		<a href={getLink()} aria-label={name} style="display:block; aspect-ratio: 3/4">
			<img
				class="card-img-top mb-0 mt-0 h-full"
				alt={name}
				loading="lazy"
				src={getImage()}
				style="object-fit: cover; object-position: 25% top"
			/>
		</a>
	</div>
	<div class="card-body">
		<div class="mx-2 h-[4em] overflow-hidden">
			<a href={getLink()}>{getFilenameFromKey(name, type)}</a>
		</div>
	</div>
</div>
