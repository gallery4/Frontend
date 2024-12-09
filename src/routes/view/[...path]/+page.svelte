<script lang="ts">
	import { goto } from '$app/navigation';
	import { navigating } from '$app/stores';
	import Breadcrumb from '$lib/Breadcrumb.svelte';
	import { compareItems, determinFileType, extractSort, getFilenameFromKey } from '$lib/utils.js';
	import {
		Button,
		Col,
		Collapse,
		Container,
		Icon,
		Image,
		Input,
		InputGroup,
		InputGroupText,
		Nav,
		Navbar,
		NavbarBrand,
		NavbarToggler,
		NavItem,
		NavLink,
		Row,
		Spinner
	} from '@sveltestrap/sveltestrap';

	import 'vidstack/bundle';
	import { swipeable } from '@react2svelte/swipeable';
	import type { SwipeEventData } from '@react2svelte/swipeable';
	import { persistBrowserLocal } from '@macfja/svelte-persistent-store';
	import { derived, writable } from 'svelte/store';

	const { data } = $props();
	const sort = persistBrowserLocal(writable('name ascending'), 'sort');
	const sortVal = derived(sort, extractSort);
	const files = derived(sortVal, (v) => {
		return {
			objects: data.files.toSorted((a: any, b: any) => compareItems(a, b, v.sortBy, v.order))
		};
	});

	const index = derived(files, (files) =>
		files.objects.findIndex((e: any) => e.name == data.current)
	);
	const previous = derived(index, (index) => (index > 0 ? $files.objects[index - 1].name : null));
	const next = derived(index, (index) =>
		index < $files.objects.length - 1 ? $files.objects[index + 1].name : null
	);

	let filetype: string | false = $state('');
	let isOpen = $state(false);
	let isImageLoaded = $state(false);

	function handleUpdate(event: CustomEvent<boolean>) {
		isOpen = event.detail;
	}

	$effect(() => {
		filetype = determinFileType(data.current);
	});

	function handler(e: CustomEvent<SwipeEventData>) {
		switch (e.detail.dir) {
			case 'Left':
				if ($next) {
					goto(`/view/${$next}`);
				}
				break;

			case 'Right':
				if ($previous) {
					goto(`/view/${$previous}`);
				}
				break;
		}
	}
</script>

<svelte:head>
	<title>Gallery - View: {data.current}</title>
</svelte:head>

{#if filetype == 'image'}
	<Container>
		<div class="position-absolute top-0 start-0 h-100 w-100" style="padding-top:10em;">
			{#if !isImageLoaded}
				<div
					class="position-absolute top-50 start-50 translate-middle justify-content-center"
					style="background-color:#00000080; padding: 1em;"
				>
					<Spinner type="border"></Spinner> Loading
				</div>
			{/if}

			<div class="position-absolute top-0 start-0 h-100 w-100" use:swipeable on:swiped={handler}>
				<Image
					src="/get/image/{data.current}"
					class="h-100 w-100"
					style="object-fit:contain; padding-top:6em;"
					onload={() => (isImageLoaded = true)}
				></Image>
			</div>

			<Button
				color="link"
				outline
				class="position-absolute top-0 start-0 h-100"
				style="width:20%;"
				onclick={() => {
					if ($previous != null) goto(`/view/${$previous}`);
				}}
			>
				<Icon name="chevron-left"></Icon>
			</Button>
			<Button
				color="link"
				outline
				class="position-absolute top-0 end-0 h-100 w-10"
				style="width:20%;"
				onclick={() => {
					if ($next != null) goto(`/view/${$next}`);
				}}
			>
				<Icon name="chevron-right"></Icon>
			</Button>
		</div>
	</Container>
{/if}

<Container class="sticky-top text-bg-light">
	<Navbar dark expand="md" container="md">
		<NavbarBrand href="/">Gallery</NavbarBrand>
		<NavbarToggler on:click={() => (isOpen = !isOpen)} />
		<Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
			<Nav class="ms-auto" navbar>
				<NavItem>
					<NavLink href="/get/file/{data.current}" target="_blank">
						<Icon name="download"></Icon>&nbsp;Get
					</NavLink>
				</NavItem>
			</Nav>
			<Nav navbar>
				<NavItem>
					<NavLink disabled={$previous == null} href={`/view/${$previous}`}>
						<Icon name="chevron-left"></Icon>&nbsp;Previous
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink disabled={$next == null} href={`/view/${$next}`}>
						<div class="d-md-none"><Icon name="chevron-right"></Icon>&nbsp;Next</div>
						<div class="d-none d-md-block">Next&nbsp;<Icon name="chevron-right"></Icon></div>
					</NavLink>
				</NavItem>
			</Nav>
		</Collapse>
	</Navbar>

	<Container>
		<Row cols={{ sm: 1, xs: 1 }}>
			<Col class="col-sm-7">
				<Breadcrumb path={data.current}></Breadcrumb>
			</Col>
			<Col class="col-sm-5">
				<InputGroup>
					<InputGroupText><Icon name="sort-down" /></InputGroupText>
					<Input type="select" bind:value={$sort}>
						<option value="name ascending">name ascending</option>
						<option value="name descending">name descending</option>
						<option value="dateTime ascending">date-time ascending</option>
						<option value="dateTime descending">date-time descending</option>
					</Input>
				</InputGroup>
			</Col>
		</Row>
	</Container>
</Container>

{#if filetype == 'video' || filetype == 'audio'}
	<Container>
		<media-player title={getFilenameFromKey(data.current, 'media')} src="/get/file/{data.current}">
			<media-provider></media-provider>
			<media-video-layout></media-video-layout>
			<media-audio-layout></media-audio-layout>
		</media-player>
	</Container>

	<Container>
		<Row cols={{ lg: 2, md: 2, sm: 1, xs: 1 }}>
			<Col>
				<Button
					class="m-1 w-100"
					disabled={$previous == null}
					onclick={() => goto(`/view/${$previous}`)}
				>
					<Icon name="chevron-left"></Icon>&nbsp;Previous
				</Button>
			</Col>
			<Col>
				<Button
					class="m-1 w-100"
					color="primary"
					disabled={$next == null}
					onclick={() => goto(`/view/${$next}`)}
				>
					<div class="d-md-none"><Icon name="chevron-right"></Icon>&nbsp;Next</div>
					<div class="d-none d-md-block">Next&nbsp;<Icon name="chevron-right"></Icon></div>
				</Button>
			</Col>
		</Row>
	</Container>
{/if}

{#if $navigating}
	<div
		class="position-absolute top-50 start-50 translate-middle justify-content-center"
		style="background-color:#00000080; padding: 1em;"
	>
		<Spinner type="border"></Spinner> Loading
	</div>
{/if}
