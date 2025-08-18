<script lang="ts">
	import { Icon } from 'svelte-icon';
	import downloadIcon from '@mdi/svg/svg/download.svg?raw';

	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PdfViewer from '$lib/components/PdfViewer.svelte';

	const { data } = $props();

	let showMenu = $state(false);
</script>

<svelte:head>
	<title>Gallery 4 - {data.filename}</title>
</svelte:head>

<Container bind:showMenu>
	<Content>
		<NavBar bind:showMenu title={data.filename} />
		<div class="z-n1 fixed start-0 top-0 top-20 h-full w-full overflow-auto">
			<PdfViewer url={data.mediaUrl} />
		</div>
	</Content>
	<SideBar bind:showMenu>
		<ul class="menu">
			<li class="menu-title">Action</li>
			<li>
				<a class="btn" href={data.mediaUrl} target="_blank">
					<Icon data={downloadIcon} /> Get
				</a>
			</li>
		</ul>

		<Breadcrumb path={data.parent} />
	</SideBar>
</Container>
