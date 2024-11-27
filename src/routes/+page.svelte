<script lang="ts">
	import {
		Container,
		Navbar,
		NavbarBrand,
		NavbarToggler	
    } from '@sveltestrap/sveltestrap';

	let isOpen = $state(false);
</script>

<svelte:head>
	<meta http-equiv="refresh" content="0; url=/browse" />
	<title>Gallery</title>
</svelte:head>

<Container class="sticky-top text-bg-light">
	<Navbar dark expand="md" container="md">
		<NavbarBrand href="/">Gallery</NavbarBrand>
		<NavbarToggler on:click={() => (isOpen = !isOpen)} />
	</Navbar>
</Container>

<Container>
	<p>click here to <a href="/browse">browse</a> if the browser does not redirect.</p>
</Container>
