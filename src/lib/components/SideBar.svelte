<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	import { Icon } from 'svelte-icon';
	import browseIcon from '@mdi/svg/svg/bookshelf.svg?raw';
	import aboutIcon from '@mdi/svg/svg/information.svg?raw';

	let { children = undefined, showMenu = $bindable() } = $props();
</script>

<div class="drawer-side z-20">
	<div
		class="drawer-overlay"
		role="none"
		onkeydown={() => (showMenu = false)}
		onclick={() => (showMenu = false)}
	></div>
	<ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
		{@render children?.()}

		<li class="menu-title">Navigation</li>

		<ul class="list">
			<li class="list-row">
				<button onclick={() => goto(new URL("/browse", page.url.origin))}>
					<Icon data={browseIcon} class="fill-slate-400 stroke-slate-800"/>&nbsp;Browse items
				</button>
			</li>
			<li class="list-row">
				<button onclick={() => goto(new URL("/about", page.url.origin))}>
					<Icon data={aboutIcon} class="fill-slate-400 stroke-slate-800"/> About
				</button>
			</li>
		</ul>
	</ul>
</div>
