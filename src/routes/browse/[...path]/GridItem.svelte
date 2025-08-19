<script lang="ts">
	import { page } from '$app/state';
	import { getIcon, getIconClass } from '$lib/icons';
	import { createBrowseURL, createViewURL } from '$lib/navigation';
	import { createElementId, determineFileType, getFilenameFromKey } from '$lib/utils';
	import { Icon } from 'svelte-icon';
	import 'vidstack/bundle';

	let { name, type } = $props();

	const filetype = $derived(determineFileType(name));
	const filename = $derived(getFilenameFromKey(name, type));

	const linkURL = $derived.by(() => {
		switch (type) {
			case 'file':
				return createViewURL(name, page.url.origin);

			case 'directory':
			case 'zip':
				return createBrowseURL(name, page.url.origin);
		}

		throw new Error('unsupported item type.');
	});

	const thumbnailURL = $derived.by(() => {
		let url = new URL('/api/thumbnail', page.url.origin);
		url.searchParams.set('path', name);
		url.searchParams.set('type', 'GRID');

		return url;
	});

	const mediaURL = $derived.by(() => {
		let url = new URL('/api/get', page.url.origin);
		url.searchParams.set('path', name);

		return url;
	});
</script>

<div class="card bg-base-100 h-full w-72 shadow-xl mx-auto" id={createElementId(filename)}>
	<a href={linkURL.toString()} aria-label={name} style="display:block; aspect-ratio: 3/4">
		{#if type == 'file'}
			{#if filetype == 'image'}
				<img
					class="card-img-top mb-0 mt-0 h-full object-cover"
					alt={name}
					loading="lazy"
					src={thumbnailURL.toString()}
				/>
			{:else}
				<Icon
					class="mx-auto mt-16 {getIconClass(type, filetype)} object-cover object-center"
					data={getIcon(type, filetype)}
					width="160"
					height="160"
				/>
			{/if}
		{:else}
			<Icon
				class="mx-auto mt-16 {getIconClass(type, filetype)} object-cover object-center"
				data={getIcon(type, filetype)}
				width="160"
				height="160"
			/>
		{/if}
	</a>
	<div class="card-body">
		<div class="mx-2 h-[4em] overflow-hidden">
			{#if type == 'file' && filetype == 'audio'}
				<media-player class="d-block" title={filename} src={mediaURL.toString()}>
					<media-provider></media-provider>
					<media-audio-layout></media-audio-layout>
				</media-player>
			{:else}
				<a href={linkURL.toString()}>{filename}</a>
			{/if}
		</div>
	</div>
</div>
