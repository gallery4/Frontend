<script lang="ts">
	import {
		Accordion,
		AccordionItem,
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

	import ThumbnailCard from './ThumbnailCard.svelte';
	import { navigating, page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Breadcrumb from '$lib/Breadcrumb.svelte';

	const { data } = $props();

	let isOpen = $state(false);

	function handleUpdate(event: CustomEvent<boolean>) {
		isOpen = event.detail;
	}

	let sort = $state('name ascending');

	const sortby = $derived(sort.startsWith('dateTime') ? 'dateTime' : 'name');
	const order = $derived(sort.endsWith('descending') ? 'descending' : 'ascending');

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

<Container class="sticky-top text-bg-light pb-3">
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

	<Container>
		<Row cols={{ sm: 1, xs: 1 }}>
			<Col class="col-sm-8">
				<Breadcrumb path={data.path} {sortby} {order}></Breadcrumb>
			</Col>
			<Col class="col-sm-4">
				<InputGroup>
					<InputGroupText><Icon name="sort-down" /></InputGroupText>
					<Input
						type="select"
						bind:value={sort}
						onchange={() => goto(`/browse/${data.path}?sortby=${sortby}&order=${order}`)}
					>
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

<Container>
	{#if $navigating}
		<div use:moveToHash>
			<Row cols={{ xl: 4, lg: 3, md: 2, sm: 1, xs: 1 }}>
				{#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as i}
					<Col class="mt-3">
						<ThumbnailCard name="loading_{i}" type="placeholder" {sortby} {order} />
					</Col>
				{/each}
			</Row>
		</div>
	{:else}
		<div use:moveToHash>
			<Row cols={{ xl: 4, lg: 3, md: 2, sm: 1, xs: 1 }}>
				{#if data.directories}
					{#each data.directories as object}
						<Col class="mt-3">
							<ThumbnailCard name={object.name} type="directory" {sortby} {order} />
						</Col>
					{/each}
				{/if}
				{#if data.archives}
					{#each data.archives as object}
						<Col class="mt-3">
							<ThumbnailCard name={object.name} type="zip" {sortby} {order} />
						</Col>
					{/each}
				{/if}
				{#if data.files}
					{#each data.files as object}
						<Col class="mt-3">
							<ThumbnailCard name={object.name} type="file" {sortby} {order} />
						</Col>
					{/each}
				{/if}
			</Row>
		</div>
	{/if}
</Container>

{#if $navigating}
	<div
		class="position-absolute top-50 start-50 translate-middle justify-content-center"
		style="background-color:#00000080; padding: 1em;"
	>
		<span> <Spinner type="border"></Spinner>&nbsp;Loading</span>
	</div>
{/if}
