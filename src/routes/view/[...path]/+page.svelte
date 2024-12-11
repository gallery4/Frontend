<script lang="ts">
	import 'vidstack/bundle';
	import { compareItems, determinFileType, extractSort, getFilenameFromKey } from '$lib/utils.js';
	import { goto } from '$app/navigation';
	import { navigating } from '$app/stores';
	import { persistBrowserLocal } from '@macfja/svelte-persistent-store';
	import { swipeable } from '@react2svelte/swipeable';
	import { writable } from 'svelte/store';
	import Breadcrumb from '$lib/Breadcrumb.svelte';
	import type { SwipeEventData } from '@react2svelte/swipeable';
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

	let isOpen = $state(false);
	let isImageLoaded = $state(false);

	function handleUpdate(event: CustomEvent<boolean>) {
		isOpen = event.detail;
	}

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
</script>

<svelte:head>
	<title>Gallery - View: {data.current}</title>
</svelte:head>

{#if filetype == 'image'}
	<Container>
		<div class="position-absolute top-0 start-0 h-100 w-100">
			{#if !isImageLoaded}
				<div
					class="position-absolute top-50 start-50 translate-middle justify-content-center"
					style="background-color:#00000080; padding: 1em;"
				>
					<Spinner type="border"></Spinner> Loading
				</div>
			{/if}

			<div class="position-absolute top-0 start-0 h-100 w-100 z-n1" 
			 	style="padding-top:70px;"
				use:swipeable on:swiped={handler}>
				<Image
					src="/get/image/{data.current}"
					class="h-100 w-100"
					style="object-fit:contain;"
					onload={() => (isImageLoaded = true)}
				></Image>
			</div>

			<Button
				color="link"
				outline
				class="position-absolute top-0 start-0 h-100"
				style="width:20%;"
				onclick={() => {
					if (previous != null) goto(`/view/${previous}`);
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
					if (next != null) goto(`/view/${next}`);
				}}
			>
				<Icon name="chevron-right"></Icon>
			</Button>
		</div>
	</Container>
{/if}

<Container class="text-bg-light pb-2" fluid>
	<Navbar dark expand="lg" container="lg">
		<NavbarBrand href="/">Gallery</NavbarBrand>
		<NavbarToggler on:click={() => (isOpen = !isOpen)} />
		<Collapse {isOpen} navbar expand="lg" on:update={handleUpdate}>
			<Nav class="ms-auto mt-lg-0 mt-3 col-lg-5" navbar>
				<Breadcrumb path={data.current}></Breadcrumb>
			</Nav>
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
		</Collapse>
	</Navbar>
</Container>

{#if filetype == 'video' || filetype == 'audio'}
	<Container class="mx-auto m-3" style="max-width:576px">
		<media-player
			class="d-block"
			title={getFilenameFromKey(data.current, 'media')}
			src="/get/file/{data.current}"
		>
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
					disabled={previous == null}
					onclick={() => goto(`/view/${previous}`)}
				>
					<Icon name="chevron-left"></Icon>&nbsp;Previous
				</Button>
			</Col>
			<Col>
				<Button
					class="m-1 w-100"
					color="primary"
					disabled={next == null}
					onclick={() => goto(`/view/${next}`)}
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
