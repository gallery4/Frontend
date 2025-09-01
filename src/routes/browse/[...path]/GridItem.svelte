<script lang="ts">
	import { page } from '$app/state';
	import { getIcon, getIconClass } from '$lib/icons';
	import { createBrowseURL, createViewURL } from '$lib/navigation';
	import { tooltipAttachment } from '$lib/tooltip';
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

	const hoverThumbImage = $derived.by(() => {
		let url = new URL('/api/thumbnail', page.url.origin);
		url.searchParams.set('path', name);
		url.searchParams.set('type', 'LIST');
		url.searchParams.set('width', '300');
		url.searchParams.set('height', '300');
		return url.toString();
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

	let loading = $state(true);
</script>

<div class="card bg-base-100 mx-auto h-full w-72 shadow-xl" id={createElementId(filename)}>
	<a href={linkURL.toString()} aria-label={name} style="display:block; aspect-ratio: 4/3">
		{#if type == 'file'}
			{#if filetype == 'image'}
				<div class="round-t-5 block h-full w-full" {@attach tooltipAttachment}>
					{#if loading}
						<div class="absolute mt-0 object-cover">
							<div class="skeleton h-54 w-72"></div>
						</div>
					{/if}

					<img
						class="h-54 absolute mt-0 w-72 object-cover"
						alt={name}
						loading="lazy"
						src={thumbnailURL.toString()}
						onload={() => (loading = false)}
					/>

					<div class="tooltip-content">
						<img class="m-3 rounded border-0" src={hoverThumbImage} alt="hover-thumb" />
					</div>
				</div>
			{:else}
				<Icon
					class="mx-auto mt-8 {getIconClass(type, filetype)} object-cover object-center"
					data={getIcon(type, filetype)}
					width="160"
					height="160"
				/>
			{/if}
		{:else}
			<Icon
				class="mx-auto mt-8 {getIconClass(type, filetype)} object-cover object-center"
				data={getIcon(type, filetype)}
				width="160"
				height="160"
			/>
		{/if}
	</a>
	<div class="card-body">
		<div class="mx-2 h-[4em]">
			{#if type == 'file' && filetype == 'audio'}
				<media-player class="d-block" title={filename} src={mediaURL.toString()}>
					<media-provider></media-provider>
					<media-audio-layout></media-audio-layout>
				</media-player>
			{:else}
				<a href={linkURL.toString()} {@attach tooltipAttachment}>
					{filename}

					<div class="tooltip-content">
						{filename}
					</div>
				</a>
			{/if}
		</div>
	</div>
</div>
