<script lang="ts">
	import { createElementId } from '$lib/utils.js';
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

	import ThumbnailCard from './ThumbnailCard.svelte';
	import { navigating, page } from '$app/stores';
	import { goto } from '$app/navigation';

	const { data } = $props();

	let isOpen = $state(false);

	function handleUpdate(event: CustomEvent<boolean>) {
		isOpen = event.detail;
	}

	interface BreadcrumbData {
		prefix: string;
		name: string;
	}
	function createBreadcrumb(path?: string): BreadcrumbData[] {
		let output = [];
		output.push({
			name: '<root>',
			prefix: ''
		});

		if (!path) {
			return output;
		}

		let parts = path?.split('/');

		for (let i = 0; i < parts?.length; i++) {
			const prefix = parts.slice(0, i + 1).join('/');

			output.push({
				name: parts[i],
				prefix: prefix
			});
		}

		return output;
	}

	let sortby = $state('name');
	let order = $state('ascending');

	sortby = $page.url.searchParams.get("sortby") != 'dateTime' ? 'name' : 'dateTime'
    order = $page.url.searchParams.get("order") != 'descending' ? 'ascending' : 'descending'

	let breadcrumbData: BreadcrumbData[] = $state([]);

	$effect(() => {
		breadcrumbData = createBreadcrumb(data.path);
	});

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
	<nav aria-label="breadcrumb">
		<ol class="breadcrumb">
			{#each breadcrumbData as b, i}
				{#if i == breadcrumbData.length - 1}
					<li class="breadcrumb-item active" aria-current="page">
						{b.name}
					</li>
				{:else}
					<li class="breadcrumb-item">
						<a href="/browse/{b.prefix}?sortby=${sortby}&order=${order}#{createElementId(breadcrumbData[i + 1].name)}">
							{b.name}
						</a>
					</li>
				{/if}
			{/each}
		</ol>
	</nav>
	<InputGroup>
		<InputGroupText>Order By</InputGroupText>
		<Input type="select" bind:value={sortby}>
			<option value="name">name</option>
			<option value="dateTime">date-time</option>
		</Input>
		<Input type="select" bind:value={order}>
			<option value="ascending">ascending</option>
			<option value="descending">descending</option>
		</Input>
		<Button onclick={() => goto(`/browse/${data.path}?sortby=${sortby}&order=${order}`)}
			><Icon name="arrow-clockwise"></Icon></Button
		>
	</InputGroup>
</Container>

{#if $navigating}
	<Container>
		<Row cols={{ lg: 3, md: 2, sm: 1, xs: 1 }}>
			<Col class="mt-3">
				<ThumbnailCard name="loading_1" type="placeholder" {sortby} {order}></ThumbnailCard>
			</Col>
			<Col class="mt-3">
				<ThumbnailCard name="loading_2" type="placeholder" {sortby} {order}></ThumbnailCard>
			</Col>
			<Col class="mt-3">
				<ThumbnailCard name="loading_3" type="placeholder" {sortby} {order}></ThumbnailCard>
			</Col>
			<Col class="mt-3">
				<ThumbnailCard name="loading_4" type="placeholder" {sortby} {order}></ThumbnailCard>
			</Col>
			<Col class="mt-3">
				<ThumbnailCard name="loading_5" type="placeholder" {sortby} {order}></ThumbnailCard>
			</Col>
			<Col class="mt-3">
				<ThumbnailCard name="loading_6" type="placeholder" {sortby} {order}></ThumbnailCard>
			</Col>
		</Row>
	</Container>
	<div
		class="position-absolute top-50 start-50 translate-middle"
		style="background-color:#00000080; padding: 1em;"
	>
		<span> <Spinner type="border"></Spinner>&nbsp;Loading</span>
	</div>
{:else}
	<Container>
		<div use:moveToHash>
			<Row cols={{ lg: 3, md: 2, sm: 1, xs: 1 }}>
				{#if data.directories}
					{#each data.directories as object}
						<Col class="mt-3">
							<ThumbnailCard name={object.name} type="directory" {sortby} {order}></ThumbnailCard>
						</Col>
					{/each}
				{/if}
				{#if data.archives}
					{#each data.archives as object}
						<Col class="mt-3">
							<ThumbnailCard name={object.name} type="zip" {sortby} {order}></ThumbnailCard>
						</Col>
					{/each}
				{/if}
				{#if data.files}
					{#each data.files as object}
						<Col class="mt-3">
							<ThumbnailCard name={object.name} type="file" {sortby} {order}></ThumbnailCard>
						</Col>
					{/each}
				{/if}
			</Row>
		</div>
	</Container>
{/if}
