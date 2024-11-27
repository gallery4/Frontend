<script lang="ts">
	import {
		Collapse,
		Container,
		Icon,
		Nav,
		Navbar,
		NavbarBrand,
		NavbarToggler,
		NavItem,
		NavLink
	} from '@sveltestrap/sveltestrap';

	let isOpen = $state(false);
	function handleUpdate(event: CustomEvent<boolean>) {
		isOpen = event.detail;
	}
</script>

<svelte:head>
	<title>Gallery: About</title>
</svelte:head>

<Container class="sticky-top text-bg-light">
	<Navbar dark expand="md" container="md">
		<NavbarBrand href="/">Gallery</NavbarBrand>
		<NavbarToggler on:click={() => (isOpen = !isOpen)} />
		<Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
			<Nav class="ms-auto" navbar>
				<NavItem>
					<NavLink onclick={() => history.back()}>
						<Icon name="arrow-return-left"></Icon>&nbsp; Go Back</NavLink
					>
				</NavItem>
			</Nav>
		</Collapse>
	</Navbar>
</Container>

<Container>
	<h1>Gallery</h1>
	<p class="font-monospace">Copyright 2024 Wutipong Wongsakuldej</p>
	<p class="font-monospace">
		Permission is hereby granted, free of charge, to any person obtaining a copy of this software
		and associated documentation files (the “Software”), to deal in the Software without
		restriction, including without limitation the rights to use, copy, modify, merge, publish,
		distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
		Software is furnished to do so, subject to the flilowing conditions:
	</p>
	<p class="font-monospace">
		The above copyright notice and this permission notice shall be included in all copies or
		substantial portions of the Software.
	</p>
	<p class="font-monospace">
		THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
		BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
		NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HliDERS BE LIABLE FOR ANY CLAIM,
		DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	</p>
</Container>
