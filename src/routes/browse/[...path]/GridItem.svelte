<script lang="ts">
	import { getIconColor, getIconImage, getIconName } from '$lib/icons';
	import { createElementId, determinFileType, getFilenameFromKey } from '$lib/utils';
	import {
		Card,
		Icon,
		Image,
		CardBody,
		CardText,
		Spinner,
		CardFooter
	} from '@sveltestrap/sveltestrap';

	let { name, type } = $props();

	let loaded = $state(false);
	
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
		if (filetype == 'image') return `/get/grid_thumbnail/${name}`;

		return getIconImage(type, filetype);
	}
</script>

<Card
	data-id={createElementId(getFilenameFromKey(name, type))}
	class="border"
	style="border-color: {getIconColor(type, determinFileType(name))} !important;"
>
	<a href={getLink()}>
		<Image
			class="card-img-top"
			loading="lazy"
			src={getImage()}
			style="height: 300px; object-fit: cover;"
			onload={() => {
				loaded = true;
			}}
		></Image>
	</a>
	<CardBody style="height: 6em; overflow:hidden;" class="fade show">
		{#if type == 'placeholder'}
			<CardText class="placeholder-glow">
				<span class="placeholder col-7"></span>
			</CardText>
		{:else}
			<CardText>
				<Icon
					name={getIconName(type, determinFileType(name))}
					style="color:{getIconColor(type, determinFileType(name))};"
				></Icon>
				&nbsp;{getFilenameFromKey(name, type)}
			</CardText>
		{/if}
	</CardBody>
	{#if !loaded}
		<div class="position-absolute bottom-0 end-0">
			<Spinner
				type="grow"
				size="sm"
				style="color:{getIconColor(type, determinFileType(name))}; margin: 1em;"
			></Spinner>
		</div>
	{/if}
</Card>
