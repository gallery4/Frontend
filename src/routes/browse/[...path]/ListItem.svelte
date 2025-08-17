<script lang="ts">
	import { page } from '$app/state';
	import { getIcon, getIconClass } from '$lib/icons';
	import { createElementId, determinFileType, getFilenameFromKey } from '$lib/utils';
	import { Icon } from 'svelte-icon';
	import 'vidstack/bundle';

	let { name, type, dateTime } = $props();
	const filetype = $derived(determinFileType(name));

	let loaded = $state(false);

	const hoverThumbImage = $derived.by(() => {
		let url = new URL('/api/thumbnail', page.url.origin);
		url.searchParams.set('path', name);
		url.searchParams.set('type', 'LIST');
		url.searchParams.set('width', '300');
		url.searchParams.set('height', '300');
		return url.toString();
	});

	const mediaUrl = $derived.by(() => {
		let url = new URL('/api/get', page.url.origin);
		url.searchParams.set('path', name);

		return url.toString();
	});

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
		url.searchParams.set('type', 'LIST');
		return url.toString();
	});

	const filename = $derived(getFilenameFromKey(name, type));
</script>

<div id={createElementId(filename)} class="h-30 m-4 flex shadow">
	<div class="m-2 my-auto w-16 flex-none">
		{#if type == 'file'}
			{#if filetype == 'video'}
				<media-player title={filename} src="/get/file/{name}">
					<media-provider></media-provider>
					<media-video-layout></media-video-layout>
				</media-player>
			{:else if filetype == 'audio'}
				<Icon
					class={getIconClass(type, filetype)}
					data={getIcon(type, filetype)}
					width="64px"
					height="64px"
				/>
			{:else if filetype == 'image'}
				{#if !loaded}
					<span class="loading loading-dots my-auto"></span>
				{/if}
				<div class="tooltip tooltip-right">
					<div class="tooltip-content">
						<img src={hoverThumbImage} alt="hover" />
					</div>

					<img
						alt="thumbnail"
						class="thumbnail"
						loading="lazy"
						src={thumbnailUrl}
						onload={() => {
							loaded = true;
						}}
					/>
				</div>
			{:else if filetype == 'pdf'}
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
	<div class="m-1 my-2 w-64 flex-1">
		<a href={linkUrl}>
			{#if type == 'placeholder'}
				<span class="placeholder"></span>
			{:else}
				{filename}
			{/if}
		</a>

		{#if type == 'file' && filetype == 'audio'}
			<media-player class="d-block" title={filename} src={mediaUrl}>
				<media-provider></media-provider>
				<media-audio-layout></media-audio-layout>
			</media-player>
		{/if}
	</div>
	<div class="my-2 w-24 flex-none">
		{new Date(dateTime).toLocaleString()}
	</div>
</div>
