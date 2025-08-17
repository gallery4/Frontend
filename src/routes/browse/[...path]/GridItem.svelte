<script lang="ts">
	import { page } from '$app/state';
	import { getIcon, getIconClass } from '$lib/icons';
	import { createElementId, determinFileType, getFilenameFromKey } from '$lib/utils';
	import { Icon } from 'svelte-icon';
	import 'vidstack/bundle';

	let { name, type } = $props();

	const filetype = $derived(determinFileType(name));
	const filename = $derived(getFilenameFromKey(name, type));

	const linkUrl = $derived.by(() => {
		switch (type) {
			case 'file':
				return `/view/${name}`;

			case 'directory':
			case 'zip':
				return `/browse/${name}`;
		}

		return '';
	});

	const thumbnailUrl = $derived.by(() => {
		let url = new URL('/api/thumbnail', page.url.origin);
		url.searchParams.set('path', name);
		url.searchParams.set('type', 'GRID');

		return url.toString();
	});

	const mediaUrl = $derived.by(() => {
		let url = new URL('/api/get', page.url.origin);
		url.searchParams.set('path', name);

		return url.toString();
	});
</script>

<div class="card bg-base-100 h-full shadow-xl" id={createElementId(filename)}>
	<div class="mb-0 mt-0">
		<a href={linkUrl} aria-label={name} style="display:block; aspect-ratio: 3/4">
			{#if type == 'file'}
				{#if filetype == 'image'}
					<img
						class="card-img-top mb-0 mt-0 h-full"
						alt={name}
						loading="lazy"
						src={thumbnailUrl}
						style="object-fit: cover; object-position: 25% top"
					/>
				{:else}
					<Icon
						class="card-img-top h-full {getIconClass(type, filetype)}"
						data={getIcon(type, filetype)}
						width="359"
						height="510"
						viewBox="0 -8 24 48"
					/>
				{/if}
			{:else}
				<Icon
					class="card-img-top h-full {getIconClass(type, filetype)}"
					data={getIcon(type, filetype)}
					width="359"
					height="510"
					viewBox="0 -8 24 48"
				/>
			{/if}
		</a>
	</div>
	<div class="card-body">
		<div class="mx-2 h-[4em] overflow-hidden">
			{#if type == 'file' && filetype == 'audio'}
				<media-player class="d-block" title={filename} src={mediaUrl}>
					<media-provider></media-provider>
					<media-audio-layout></media-audio-layout>
				</media-player>
			{:else}
				<a href={linkUrl}>{filename}</a>
			{/if}
		</div>
	</div>
</div>
