<script lang="ts">
	import { persistBrowserLocal } from '@macfja/svelte-persistent-store';
	import { writable } from 'svelte/store';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import GridItem from './GridItem.svelte';
	import ListItem from './ListItem.svelte';
	import { compareItems, extractSort } from '$lib/utils';
	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import { page } from '$app/state';

	const { data } = $props();

	const browseView = persistBrowserLocal(writable('grid'), 'browseView');
	const sort = persistBrowserLocal(writable('name ascending'), 'sort');
	const { sortBy, order } = $derived(extractSort($sort));

	const files = $derived({
		objects: data.response.files.toSorted((a: any, b: any) => compareItems(a, b, sortBy, order))
	});

	const archives = $derived({
		objects: data.response.archives.toSorted((a: any, b: any) => compareItems(a, b, sortBy, order))
	});

	const directories = $derived({
		objects: data.response.directories.toSorted((a: any, b: any) =>
			compareItems(a, b, sortBy, order)
		)
	});

	function moveToHash(node: Element) {
		const hash = page.url.hash;
		if (!hash) return;

		const element = node.querySelector(`div[data-id="${hash.substring(1)}"]`);

		element?.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
			inline: 'nearest'
		});
	}

	let showMenu = $state(false);
</script>

<svelte:head>
	<title>Gallery - Browse: {data.response.path}</title>
</svelte:head>

<Container bind:showMenu>
	<Content>
		<NavBar bind:showMenu title="Browse: {data.response.path}" />
		<div class="prose container mx-auto mt-4 max-w-[1024px]">
			{#if $browseView == 'grid'}
				<div use:moveToHash class="grid grid-cols-1 gap-8 md:grid-cols-3">
					{#if directories}
						{#each directories.objects as object}
							<GridItem name={object.name} type="directory" />
						{/each}
					{/if}
					{#if archives}
						{#each archives.objects as object}
							<GridItem name={object.name} type="zip" />
						{/each}
					{/if}
					{#if files}
						{#each files.objects as object}
							<GridItem name={object.name} type="file" />
						{/each}
					{/if}
				</div>
			{:else if  $browseView == 'list'}
				<div use:moveToHash>
					{#if directories}
						{#each directories.objects as object}
							<ListItem name={object.name} type="directory" dateTime={object.dateTime} />
						{/each}
					{/if}
					{#if archives}
						{#each archives.objects as object}
							<ListItem name={object.name} type="zip" dateTime={object.dateTime} />
						{/each}
					{/if}
					{#if files}
						{#each files.objects as object}
							<ListItem name={object.name} type="file" dateTime={object.dateTime} />
						{/each}
					{/if}
				</div>
			{/if}
		</div>
	</Content>
	<SideBar bind:showMenu></SideBar>
</Container>
