<script lang="ts">
	import GridItem from './GridItem.svelte';
	import ListItem from './ListItem.svelte';
	import { compareItems, getFilenameFromKey } from '$lib/utils';
	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import { page } from '$app/state';

	import { Icon } from 'svelte-icon';
	import viewGridIcon from '@mdi/svg/svg/view-grid.svg?raw';
	import viewListIcon from '@mdi/svg/svg/view-list.svg?raw';

	import { Timestamp } from '$lib/grpc/google/protobuf/timestamp';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { createBrowseURL } from '$lib/navigation';

	const { data } = $props();

	let browseView: 'grid' | 'list' = $state('grid');
	let sortBy = $state('name');
	let order = $state('ascending');

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

	let parent = $derived.by(() => {
		if (data.response.path == '') {
			return undefined;
		}
		const lastSep = data.response.path.lastIndexOf('/');

		if (lastSep == -1) {
			return '';
		}

		return data.response.path.substring(0, lastSep);
	});
</script>

<svelte:head>
	<title>Gallery 4 - {getFilenameFromKey(data.response.path, 'directory')}</title>
</svelte:head>

<Container bind:showMenu>
	<Content>
		<NavBar
			bind:showMenu
			rootPage={data.response.path == ''}
			upUrl={parent == undefined ? undefined : createBrowseURL(parent, page.url.origin).toString()}
		>
			<div class="text-xl hidden md:inline">
				<div class=" whitespace-nowrap">{getFilenameFromKey(data.response.path, 'directory')}</div>
			</div>
		</NavBar>
		<div class="prose container mx-auto mt-4 max-w-[1024px]">
			{#if browseView == 'grid'}
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
			{:else if browseView == 'list'}
				<ul class="list" use:moveToHash>
					{#if directories}
						{#each directories.objects as object}
							<ListItem
								name={object.name}
								type="directory"
								dateTime={object.dateTime ? Timestamp.toDate(object.dateTime) : new Date()}
							/>
						{/each}
					{/if}
					{#if archives}
						{#each archives.objects as object}
							<ListItem
								name={object.name}
								type="zip"
								dateTime={object.dateTime ? Timestamp.toDate(object.dateTime) : new Date()}
							/>
						{/each}
					{/if}
					{#if files}
						{#each files.objects as object}
							<ListItem
								name={object.name}
								type="file"
								dateTime={object.dateTime ? Timestamp.toDate(object.dateTime) : new Date()}
							/>
						{/each}
					{/if}
				</ul>
			{/if}
		</div>
	</Content>
	<SideBar bind:showMenu>
		<Breadcrumb path={data.response.path} />
		<ul class="menu">
			<li class="menu-title">View</li>
			<li>
				<button
					class={browseView == 'grid' ? 'menu-active' : ''}
					onclick={() => (browseView = 'grid')}
				>
					<Icon data={viewGridIcon} /> Grid
				</button>
			</li>

			<li>
				<button
					class={browseView == 'list' ? 'menu-active' : ''}
					onclick={() => (browseView = 'list')}
				>
					<Icon data={viewListIcon} /> List
				</button>
			</li>
		</ul>
	</SideBar>
</Container>
