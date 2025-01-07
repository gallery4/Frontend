<script lang="ts">
	import { getIconColor, getIconImage, getIconName } from '$lib/icons';
	import { createElementId, determinFileType, getFilenameFromKey } from '$lib/utils';
	import { Icon, Spinner, Row, Col } from '@sveltestrap/sveltestrap';
	import { tippy } from 'svelte-tippy';
	import 'tippy.js/dist/tippy.css';
	import 'vidstack/bundle';

	let { name, type, dateTime } = $props();
	const filetype = $derived(determinFileType(name));

	let loaded = $state(false);

	const hoverThumbImage = $derived(`/get/list_thumbnail/${name}?width=300&height=300"`);

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
		if (filetype == 'image') return `/get/list_thumbnail/${name}?width=150&height=100`;

		return getIconImage(type, filetype);
	}
</script>

<Row
	data-id={createElementId(getFilenameFromKey(name, type))}
	class="pt-3 pb-3 ms-1 me-1 border-bottom"
	cols={{ xs: 1, md: 3 }}
>
	<Col>
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
					<Spinner size="sm" type="grow" style="color:{getIconColor(type, filetype)};" />
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
					use:tippy={{
						allowHTML: true,
						content: `<img src="${hoverThumbImage} class="rounded"></img>`
					}}
				/>
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
	</Col>
	<Col>
		<a href={getLink()}>
			{#if type == 'placeholder'}
				<span class="placeholder col-7"></span>
			{:else}
				<Icon name={getIconName(type, filetype)} style="color:{getIconColor(type, filetype)};"
				></Icon>
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
	</Col>
	<Col class="col-3">
		{new Date(dateTime).toLocaleString()}
	</Col>
</Row>
