<script lang="ts">
	import { page } from '$app/state';
	import { getIconColor, getIconImage, getIconName } from '$lib/icons';
	import { createElementId, determinFileType, getFilenameFromKey } from '$lib/utils';
	import 'vidstack/bundle';

	let { name, type, dateTime } = $props();
	const filetype = $derived(determinFileType(name));

	let loaded = $state(false);

	const hoverThumbImage = $derived(`/api/thumbnail/${name}?width=300&height=300"`);

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

	function getImageSource(): string {
		if (type != 'file') return getIconImage(type, false);

		const filetype = determinFileType(name);
		if (filetype == 'image') {
			let url = new URL('/api/thumbnail', page.url.origin);
			url.searchParams.set('path', name);

			return url.toString();
		}

		return getIconImage(type, filetype);
	}
</script>

<div id={createElementId(getFilenameFromKey(name, type))} class="flex shadow m-4">
	<div class="w-16 flex-none m-1">
		{#if type == 'file'}
			{#if filetype == 'video'}
				<media-player title={getFilenameFromKey(name, 'media')} src="/get/file/{name}">
					<media-provider></media-provider>
					<media-video-layout></media-video-layout>
				</media-player>
			{:else if filetype == 'audio'}
				<img alt="thumbnail" style="height: 100px;" loading="lazy" src={getImageSource()} />
			{:else if filetype == 'image'}
				{#if !loaded}
					<span
						class="loading loading-dots loading-sm"
						style="color:{getIconColor(type, filetype)};"
					></span>
				{/if}
				<img
					alt="thumbnail"
					class="thumbnail"
					style="height: 100px; width: 150px; object-fit:contain;"
					loading="lazy"
					src={getImageSource()}
					onload={() => {
						loaded = true;
					}}
				/>
				<!--TODO: makde this hover
					use:tippy={{
						allowHTML: true,
						content: `<img src="${hoverThumbImage} class="rounded"></img>`
					}-->
			{:else if filetype == 'pdf'}
				<img alt="thumbnail" style="height: 100px;" loading="lazy" src={getImageSource()} />
			{/if}
		{:else}
			<img
				alt="thumbnail"
				style="height: 100px;"
				loading="lazy"
				src={getImageSource()}
				onload={() => {
					loaded = true;
				}}
			/>
		{/if}
	</div>
	<div class="w-64 flex-1">
		<a href={getLink()}>
			{#if type == 'placeholder'}
				<span class="placeholder col-7"></span>
			{:else}
				<!--Icon name={getIconName(type, filetype)} style="color:{getIconColor(type, filetype)};"
				></Icon -->
				&nbsp;{getFilenameFromKey(name, type)}
			{/if}
		</a>
		{#if type == 'file' && filetype == 'audio'}
			<media-player
				class="d-block"
				title={getFilenameFromKey(name, 'media')}
				src="/get/file/{name}"
			>
				<media-provider></media-provider>
				<media-audio-layout></media-audio-layout>
			</media-player>
		{/if}
	</div>
	<div class="w-16 flex-1">
		{new Date(dateTime).toLocaleString()}
	</div>
</div>
