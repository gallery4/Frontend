<script lang="ts">
	import { goto } from '$app/navigation';
	import { navigating } from '$app/stores';
	import Breadcrumb from '$lib/Breadcrumb.svelte';
	import { createElementId, determinFileType, getFilenameFromKey } from '$lib/utils.js';
	import {
		Button,
		Col,
		Collapse,
		Container,
		Icon,
		Image,
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

	const { data } = $props();

	let filetype: string | false = $state('');
	let isOpen = $state(false);
	let isImageLoaded = $state(false);

	function handleUpdate(event: CustomEvent<boolean>) {
		isOpen = event.detail;
	}

	$effect(() => {
		filetype = determinFileType(data.current);
	});
</script>

<svelte:head>
	<title>Gallery - View: {data.current}</title>
</svelte:head>

{#if filetype == 'image'}
	<Container>
		<div class="position-absolute top-0 start-0 h-100 w-100" style="padding-top:10em;">
			{#if !isImageLoaded}
				<div
					class="position-absolute top-50 start-50 translate-middle"
					style="background-color:#00000080; padding: 1em;"
				>
					<Spinner type="border"></Spinner> Loading
				</div>
			{/if}

			<div class="position-absolute top-0 start-0 h-100 w-100">
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
					if (data.previous != null) 
						goto(`/view/${data.previous}?sortby=${data.sortby}&order=${data.order}`);
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
					if (data.next != null) 
						goto(`/view/${data.next}?sortby=${data.sortby}&order=${data.order}`);
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
					<NavLink disabled={data.previous == null} href={`/view/${data.previous}?sortby=${data.sortby}&order=${data.order}`}>
						<Icon name="chevron-left"></Icon>&nbsp;Previous
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink disabled={data.next == null} href={`/view/${data.next}?sortby=${data.sortby}&order=${data.order}`}>
						<div class="d-md-none"><Icon name="chevron-right"></Icon>&nbsp;Next</div>
						<div class="d-none d-md-block">Next&nbsp;<Icon name="chevron-right"></Icon></div>
					</NavLink>
				</NavItem>
			</Nav>
		</Collapse>
	</Navbar>

	<Breadcrumb sortby={data.sortby} order={data.order} path={data.current}></Breadcrumb>
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
					disabled={data.previous == null}
					onclick={() => goto(`/view/${data.previous}?sortby=${data.sortby}&order=${data.order}`)}
				>
					<Icon name="chevron-left"></Icon>&nbsp;Previous
				</Button>
			</Col>
			<Col>
				<Button
					class="m-1 w-100"
					color="primary"
					disabled={data.next == null}
					onclick={() => goto(`/view/${data.next}?sortby=${data.sortby}&order=${data.order}`)}
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
		class="position-absolute top-50 start-50 translate-middle"
		style="background-color:#00000080; padding: 1em;"
	>
		<Spinner type="border"></Spinner> Loading
	</div>
{/if}
