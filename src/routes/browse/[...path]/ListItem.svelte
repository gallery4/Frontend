<script lang="ts">
	import { page } from '$app/state';
	import { getIcon, getIconClass } from '$lib/icons';
	import { createBrowseURL, createViewURL } from '$lib/navigation';
	import { tooltipAttachment } from '$lib/tooltip';
	import { createElementId, determineFileType, getFilenameFromKey } from '$lib/utils';
	import { Icon } from 'svelte-icon';
	import 'vidstack/bundle';

	let { name, type, dateTime } = $props();
	const filetype = $derived(determineFileType(name));

	let loaded = $state(false);

	const hoverThumbImage = $derived.by(() => {
		let url = new URL('/api/thumbnail', page.url.origin);
		url.searchParams.set('path', name);
		url.searchParams.set('type', 'LIST');
		url.searchParams.set('width', '300');
		url.searchParams.set('height', '300');
		return url.toString();
	});

	const mediaURL = $derived.by(() => {
		let url = new URL('/api/get', page.url.origin);
		url.searchParams.set('path', name);

		return url.toString();
	});

	const linkURL = $derived.by(() => {
		switch (type) {
			case 'file':
				return createViewURL(name, page.url.origin);

			case 'directory':
			case 'zip':
				return createBrowseURL(name, page.url.origin);
		}

		throw new Error('Unsupported item type.');
	});

	const thumbnailURL = $derived.by(() => {
		let url = new URL('/api/thumbnail', page.url.origin);
		url.searchParams.set('path', name);
		url.searchParams.set('type', 'GRID');
		url.searchParams.set('width', '64');
		url.searchParams.set('height', '64');
		return url.toString();
	});

	const filename = $derived(getFilenameFromKey(name, type));
</script>

<li id={createElementId(filename)} class="list-row">
	<div class="">
		{#if type == 'file'}
			{#if filetype == 'image'}
				<div class="size-[64px]" {@attach tooltipAttachment}>
					<div class="tooltip-content">
						<img class="m-3 rounded border-0" src={hoverThumbImage} alt="hover" />
					</div>

					<div>
						{#if !loaded}
							<div class="skeleton size-[64px]"></div>
						{/if}

						<img
							alt="thumbnail"
							loading="lazy"
							src={thumbnailURL}
							class="rounded-box absolute mb-0 mt-0"
							onload={() => {
								loaded = true;
							}}
						/>
					</div>
				</div>
			{:else}
				<Icon
					data={getIcon(type, filetype)}
					width="64px"
					height="64px"
					class={getIconClass(type, filetype)}
				/>
			{/if}
		{:else}
			<Icon
				data={getIcon(type, filetype)}
				width="64px"
				height="64px"
				class={getIconClass(type, filetype)}
			/>
		{/if}
	</div>
	<div class="list-col-grow">
		<a class="link link-hover" href={linkURL.toString()}>
			{#if type == 'placeholder'}
				<span class="placeholder"></span>
			{:else}
				{filename}
			{/if}
		</a>

		{#if type == 'file' && filetype == 'audio'}
			<media-player class="d-block" title={filename} src={mediaURL}>
				<media-provider></media-provider>
				<media-audio-layout></media-audio-layout>
			</media-player>
		{/if}
	</div>
	<div class="my-2 w-24 flex-none">
		{new Date(dateTime).toLocaleString()}
	</div>
</li>
