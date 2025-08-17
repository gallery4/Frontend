<script lang="ts">
	import 'vidstack/bundle';
	import { compareItems, determinFileType, extractSort, getFilenameFromKey } from '$lib/utils.js';
	import { goto } from '$app/navigation';
	import { persistBrowserLocal } from '@macfja/svelte-persistent-store';
	import { swipeable } from '@react2svelte/swipeable';
	import { writable } from 'svelte/store';
	import type { SwipeEventData } from '@react2svelte/swipeable';
	import SvelteReader from 'svelte-reader';
	// import PdfViewer from '$lib/components/PdfViewer.svelte';

	import { Icon } from 'svelte-icon';
	import prevIcon from '@mdi/svg/svg/chevron-left.svg?raw';
	import nextIcon from '@mdi/svg/svg/chevron-right.svg?raw';
	import downloadIcon from '@mdi/svg/svg/download.svg?raw';

	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import SideBar from '$lib/components/SideBar.svelte';

	import { page } from '$app/state';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	const { data } = $props();
	const sort = persistBrowserLocal(writable('name ascending'), 'sort');
	const { sortBy, order } = $derived(extractSort($sort));

	const files = $derived(
		data.files.toSorted((a: any, b: any) => compareItems(a, b, sortBy, order))
	);

	const index = $derived(files.findIndex((e: any) => e.name == data.current));
	const previous = $derived(index > 0 ? files[index - 1].name : null);
	const next = $derived(index < files.length - 1 ? files[index + 1].name : null);

	const filetype = $derived(determinFileType(data.current));

	let isImageLoaded = $state(false);

	function handler(e: CustomEvent<SwipeEventData>) {
		switch (e.detail.dir) {
			case 'Left':
				if (next) {
					goto(`/view/${next}`);
				}
				break;

			case 'Right':
				if (previous) {
					goto(`/view/${previous}`);
				}
				break;
		}
	}

	let showMenu = $state(false);

	const mediaUrl = $derived.by(() => {
		let url = new URL('/api/get', page.url.origin);
		url.searchParams.set('path', data.current);

		return url.toString();
	});
</script>

<svelte:head>
	<title>Gallery - View: {data.current}</title>
</svelte:head>

<Container bind:showMenu>
	<Content>
		<NavBar bind:showMenu title="Browse: {data.current}" />
		{#if filetype == 'image'}
			<div class="top-18 fixed bottom-0 end-0 start-0">
				{#if !isImageLoaded}
					<div class="h-full w-full">
						<span class="loading loading-dots loading-sm"></span>
					</div>
				{/if}

				<div class="h-full w-full" use:swipeable onswiped={handler}>
					<img
						alt={getFilenameFromKey(data.current, 'image')}
						src={(() => {
							const url = new URL('/api/image', page.url.origin);
							url.searchParams.set('path', data.current);
							return url.toString();
						})()}
						class="h-full w-full"
						style="object-fit:contain;"
						onload={() => (isImageLoaded = true)}
					/>
				</div>

				<button
					class="fixed inset-y-1/2 start-2 z-10 h-1/2 w-20 -translate-y-1/2 cursor-pointer text-gray-500/50 hover:text-gray-500"
					onclick={() => {
						if (previous != null) goto(`/view/${previous}`);
					}}
				>
					<Icon data={prevIcon} class="mx-auto"></Icon>
				</button>

				<button
					class="fixed inset-y-1/2 end-2 z-10 h-1/2 w-20 -translate-y-1/2 cursor-pointer text-gray-500/50 hover:text-gray-500"
					onclick={() => {
						if (next != null) goto(`/view/${next}`);
					}}
				>
					<Icon data={nextIcon} class="mx-auto"></Icon>
				</button>
			</div>

			<!--
		{:else if filetype == 'pdf'}
			<div>
				<div
					class="position-absolute h-100 w-100 h-100 w-100 z-n1 start-0 top-0 overflow-auto"
					style="padding-top:65px;"
				>
					<PdfViewer url="/get/file/{data.current}" />
				</div>
			</div>
			
			TODO: restore the epub reader.
			{:else if filetype == 'epub'}
				<Container>
					<div
						class="position-absolute top-0 start-0 h-100 w-100 top-0 start-0 h-100 w-100 z-n1"
						style="padding-top:65px;"
					>
						<SvelteReader url="/get/file/{data.current}" title="&nbsp;"/>
					</div>
				</Container>
			{/if}
		-->
		{:else if filetype == 'audio' || filetype == 'video'}
			<div class="mx-auto mt-4 max-w-[1024px]">
				<media-player
					class="d-block"
					title={getFilenameFromKey(data.current, 'media')}
					src={mediaUrl}
				>
					<media-provider></media-provider>
					<media-audio-layout></media-audio-layout>
					<media-video-layout></media-video-layout>
				</media-player>

				<div class="join py-4">
					<button
						class="btn join-item"
						onclick={() => {
							if (previous != null) goto(`/view/${previous}`);
						}}
					>
						<Icon data={prevIcon}></Icon>&nbsp;Previous
					</button>

					<button
						class="btn join-item"
						onclick={() => {
							if (next != null) goto(`/view/${next}`);
						}}
					>
						<Icon data={nextIcon}></Icon>&nbsp;Next
					</button>
				</div>
			</div>
		{/if}
	</Content>
	<SideBar bind:showMenu>
		<ul class="menu">
			<li class="menu-title">Action</li>
			<li>
				<a
					class="btn"
					href={mediaUrl}
					target="_blank"
				>
					<Icon data={downloadIcon} /> Get
				</a>
			</li>
		</ul>

		<Breadcrumb path={data.parent}/>

		<!-- TODO: Implement menut
		<Nav navbar class="ms-lg-1 mt-lg-0 mt-3">
				<InputGroup>
					<InputGroupText><Icon name="sort-down" /></InputGroupText>
					<Input type="select" bind:value={$sort}>
						<option value="name ascending">name ascending</option>
						<option value="name descending">name descending</option>
						<option value="dateTime ascending">date-time ascending</option>
						<option value="dateTime descending">date-time descending</option>
					</Input>
				</InputGroup>
			</Nav>
			<Nav navbar class="ms-auto">
				<NavItem>
					<NavLink href="/get/file/{data.current}" target="_blank">
						<Icon name="download"></Icon>&nbsp;Get
					</NavLink>
				</NavItem>
			</Nav>
			<Nav navbar>
				<NavItem>
					<NavLink disabled={previous == null} href={`/view/${previous}`}>
						<Icon name="chevron-left"></Icon>&nbsp;Previous
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink disabled={next == null} href={`/view/${next}`}>
						<div class="d-lg-none"><Icon name="chevron-right"></Icon>&nbsp;Next</div>
						<div class="d-none d-lg-block">Next&nbsp;<Icon name="chevron-right"></Icon></div>
					</NavLink>
				</NavItem>
			</Nav>
		-->
	</SideBar>
</Container>
