<script lang="ts">
	import {
		Button,
		Col,
		Collapse,
		Container,
		Icon,
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

	import { navigating, page } from '$app/stores';
	import { persistBrowserLocal } from '@macfja/svelte-persistent-store';
	import { writable } from 'svelte/store';
	import Breadcrumb from '$lib/Breadcrumb.svelte';
	import GridItem from './GridItem.svelte';
	import ListItem from './ListItem.svelte';
	import { compareItems, extractSort } from '$lib/utils';

	const { data } = $props();

	const browseView = persistBrowserLocal(writable('grid'), 'browseView');
	const sort = persistBrowserLocal(writable('name ascending'), 'sort');
	const { sortBy, order } = $derived(extractSort($sort));

	const files = $derived({
		objects: data.files.toSorted((a: any, b: any) => compareItems(a, b, sortBy, order))
	});

	const archives = $derived({
		objects: data.archives.toSorted((a: any, b: any) => compareItems(a, b, sortBy, order))
	});

	const directories = $derived({
		objects: data.directories.toSorted((a: any, b: any) => compareItems(a, b, sortBy, order))
	});

	let isOpen = $state(false);

	function handleUpdate(event: CustomEvent<boolean>) {
		isOpen = event.detail;
	}

	function moveToHash(node: Element) {
		const hash = $page.url.hash;
		if (!hash) return;

		const element = node.querySelector(`div[data-id="${hash.substring(1)}"]`);

		element?.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
			inline: 'nearest'
		});
	}
</script>

<svelte:head>
	<title>Gallery - Browse: {data.path}</title>
</svelte:head>

<Container class="sticky-top text-bg-light pb-3" fluid >
	<Navbar dark expand="md" container="md">
		<NavbarBrand href="/">Gallery</NavbarBrand>
		<NavbarToggler on:click={() => (isOpen = !isOpen)} />
		<Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
			<Nav class="ms-auto" navbar>
				<NavItem>
					<NavLink href="/about"><Icon name="info-circle"></Icon>&nbsp;About</NavLink>
				</NavItem>
			</Nav>
		</Collapse>
	</Navbar>

	<Container fluid>
		<Row cols={{ sm: 1, xs: 1 }}>
			<Col md={7}>
				<Breadcrumb path={data.path}></Breadcrumb>
			</Col>
			<Col md={5}>
				<InputGroup>
					<InputGroupText><Icon name="sort-down" /></InputGroupText>
					<Input type="select" bind:value={$sort}>
						<option value="name ascending">name ascending</option>
						<option value="name descending">name descending</option>
						<option value="dateTime ascending">date-time ascending</option>
						<option value="dateTime descending">date-time descending</option>
					</Input>

					<Button active={$browseView == 'grid'} onclick={() => browseView.set('grid')}>
						<Icon name="grid" />
					</Button>
					<Button active={$browseView == 'list'} onclick={() => browseView.set('list')}>
						<Icon name="list" />
					</Button>
				</InputGroup>
			</Col>
		</Row>
	</Container>
</Container>

{#if $browseView == 'grid'}
	<Container>
		{#if $navigating}
			<div use:moveToHash>
				<Row cols={{ xl: 4, lg: 3, md: 2, sm: 1, xs: 1 }}>
					{#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as i}
						<Col class="mt-3">
							<GridItem name="loading_{i}" type="placeholder" />
						</Col>
					{/each}
				</Row>
			</div>
		{:else}
			<div use:moveToHash>
				<Row cols={{ xl: 4, lg: 3, md: 2, sm: 1, xs: 1 }}>
					{#if directories}
						{#each directories.objects as object}
							<Col class="mt-3">
								<GridItem name={object.name} type="directory" />
							</Col>
						{/each}
					{/if}
					{#if archives}
						{#each archives.objects as object}
							<Col class="mt-3">
								<GridItem name={object.name} type="zip" />
							</Col>
						{/each}
					{/if}
					{#if files}
						{#each files.objects as object}
							<Col class="mt-3">
								<GridItem name={object.name} type="file" />
							</Col>
						{/each}
					{/if}
				</Row>
			</div>
		{/if}
	</Container>
{/if}

{#if $browseView == 'list'}
	<Container>
		{#if $navigating}
			<div use:moveToHash>
				{#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as i}
					<ListItem name="loading_{i}" type="placeholder" dateTime={new Date()} />
				{/each}
			</div>
		{:else}
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
	</Container>
{/if}

{#if $navigating}
	<div
		class="position-absolute top-50 start-50 translate-middle justify-content-center"
		style="background-color:#00000080; padding: 1em;"
	>
		<span> <Spinner type="border"></Spinner>&nbsp;Loading</span>
	</div>
{/if}
