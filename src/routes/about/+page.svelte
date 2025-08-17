<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Content from '$lib/components/Content.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import SideBar from '$lib/components/SideBar.svelte';

	import { Icon } from 'svelte-icon';
	import githubIcon from '@mdi/svg/svg/github.svg?raw';

	let showMenu = $state(false);
</script>

<svelte:head>
	<title>Gallery: About</title>
</svelte:head>

<Container bind:showMenu>
	<Content>
		<NavBar bind:showMenu title="About" />
		<div class="container mx-auto mt-4 prose max-w-[1024px]">
			<h1>Gallery 4</h1>

			<a class="btn" href="https://github.com/gallery4">
				<Icon data={githubIcon} />&nbsp;Github
			</a>

			<div class="mt-4">
				<p >Copyright 2024-2025 Wutipong Wongsakuldej</p>
				<p >
					Permission is hereby granted, free of charge, to any person obtaining a copy of this
					software and associated documentation files (the “Software”), to deal in the Software
					without restriction, including without limitation the rights to use, copy, modify, merge,
					publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
					to whom the Software is furnished to do so, subject to the flilowing conditions:
				</p>
				<p >
					The above copyright notice and this permission notice shall be included in all copies or
					substantial portions of the Software.
				</p>
				<p >
					THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
					INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
					PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HliDERS BE LIABLE
					FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
					OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
					DEALINGS IN THE SOFTWARE.
				</p>
			</div>
		</div>
	</Content>

	<SideBar bind:showMenu />
</Container>
