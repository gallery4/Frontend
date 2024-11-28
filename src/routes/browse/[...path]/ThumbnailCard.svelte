<script lang="ts">
	import { createElementId, determinFileType, getFilenameFromKey } from '$lib/utils';
	import { Card, Icon, Image, CardBody, CardText } from '@sveltestrap/sveltestrap';

	let { name, type } = $props();

	function getLink(name: string, type: string): string {
		switch (type) {
			case 'file':
				return `/view/${name}`;

			case 'directory':
			case 'zip':
				return `/browse/${name}`;
		}

		return '';
	}

	function getIcon(name: string, type: string): string {
		switch (type) {
			case 'file':
				const filetype = determinFileType(name);

				switch (filetype) {
					case 'image':
						return 'image';
					case 'audio':
						return 'file-music';
					case 'video':
						return 'file-play';
				}

				return '';

			case 'directory':
				return 'folder';

			case 'zip':
				return 'file-zip';
			
			case 'placeholder':
				return 'hourglass';
		}

		return '';
	}

	function getImageSource(name: string, type: string): string {
		switch (type) {
			case 'file':
				const filetype = determinFileType(name);
				switch (filetype) {
					case 'image':
						return `/get/thumbnail/${name}`;
					case 'audio':
						return AUDIO_IMAGE_SOURCE;
					case 'video':
						return VIDEO_IMAGE_SOURCE;
				}

				return '';

			case 'directory':
				return DIRECTORY_IMAGE_SOURCE;

			case 'zip':
				return ZIP_IMAGE_SOURCE;

			case 'placeholder':
				return PLACEHOLDER_IMAGE_SOURCE;
		}

		return '';
	}

	function getIconColor(type: string): string {
		switch (type) {
			case 'file':
				const filetype = determinFileType(name);
				switch (filetype) {
					case 'image':
						return IMAGE_ICON_COLOR;
					case 'audio':
						return AUDIO_ICON_COLOR;
					case 'video':
						return VIDEO_ICON_COLOR;
				}

				return '';

			case 'directory':
				return DIRECTORY_ICON_COLOR;

			case 'zip':
				return ZIP_ICON_COLOR;
			
			case 'placeholder':
				return PLACEHOLDER_ICON_COLOR;
		}

		return '';
	}

	const DIRECTORY_ICON_COLOR = 'goldenrod';
	const ZIP_ICON_COLOR = 'yellowgreen';
	const VIDEO_ICON_COLOR = 'teal';
	const IMAGE_ICON_COLOR = 'lightblue';
	const AUDIO_ICON_COLOR = 'yellow';
	const PLACEHOLDER_ICON_COLOR = 'darkgray';

	const DIRECTORY_IMAGE_SOURCE = `
		data:image/svg+xml;utf8,
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="16" fill="${DIRECTORY_ICON_COLOR}" class="bi bi-folder " viewBox="-8 -8 32 32">
			<path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139q.323-.119.684-.12h5.396z"/>
		</svg>`;

	const ZIP_IMAGE_SOURCE = `
		data:image/svg+xml;utf8,
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="16" fill="${ZIP_ICON_COLOR}" class="bi bi-file-zip" viewBox="-8 -8 32 32">
			<path d="M6.5 7.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v.938l.4 1.599a1 1 0 0 1-.416 1.074l-.93.62a1 1 0 0 1-1.109 0l-.93-.62a1 1 0 0 1-.415-1.074l.4-1.599zm2 0h-1v.938a1 1 0 0 1-.03.243l-.4 1.598.93.62.93-.62-.4-1.598a1 1 0 0 1-.03-.243z"/>
			<path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm5.5-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9v1H8v1h1v1H8v1h1v1H7.5V5h-1V4h1V3h-1V2h1z"/>
		</svg>`;

	const VIDEO_IMAGE_SOURCE = `
		data:image/svg+xml;utf8,
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="16" fill="${VIDEO_ICON_COLOR}" class="bi bi-file-play" viewBox="-8 -8 32 32">
			<path d="M6 10.117V5.883a.5.5 0 0 1 .757-.429l3.528 2.117a.5.5 0 0 1 0 .858l-3.528 2.117a.5.5 0 0 1-.757-.43z"/>
			<path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"/>
		</svg>`;

	const AUDIO_IMAGE_SOURCE = `
		data:image/svg+xml;utf8,
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="16" fill="${AUDIO_ICON_COLOR}" class="bi bi-file-music" viewBox="-8 -8 32 32">
			<path d="M10.304 3.13a1 1 0 0 1 1.196.98v1.8l-2.5.5v5.09c0 .495-.301.883-.662 1.123C7.974 12.866 7.499 13 7 13s-.974-.134-1.338-.377C5.302 12.383 5 11.995 5 11.5s.301-.883.662-1.123C6.026 10.134 6.501 10 7 10c.356 0 .7.068 1 .196V4.41a1 1 0 0 1 .804-.98z"/>
			<path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"/>
		</svg>`;

	const PLACEHOLDER_IMAGE_SOURCE=`
		data:image/svg+xml;utf8,
		<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="${PLACEHOLDER_ICON_COLOR}" class="bi bi-hourglass" viewBox="-8 -8 32 32">
			<path d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1-.5-.5m2.5.5v1a3.5 3.5 0 0 0 1.989 3.158c.533.256 1.011.791 1.011 1.491v.702c0 .7-.478 1.235-1.011 1.491A3.5 3.5 0 0 0 4.5 13v1h7v-1a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351v-.702c0-.7.478-1.235 1.011-1.491A3.5 3.5 0 0 0 11.5 3V2z"/>
		</svg>
	`;
</script>

<Card data-id={createElementId(getFilenameFromKey(name, type))}>
	<a href={getLink(name, type)}>
		<Image
			class="card-img-top"
			loading="lazy"
			src={getImageSource(name, type)}
			style="height: 300px; object-fit: cover;"
		></Image>
	</a>
	<CardBody style="height: 6em; overflow:hidden;" class="fade show">
		{#if type=="placeholder"}
			<CardText class="placeholder-glow">
				<span class="placeholder col-7"></span>
			</CardText>
		{:else}
			<CardText>
				<Icon name={getIcon(name, type)} style="color:{getIconColor(type)};"></Icon>
				&nbsp;{getFilenameFromKey(name, type)}
			</CardText>
		{/if}
		
	</CardBody>
</Card>
