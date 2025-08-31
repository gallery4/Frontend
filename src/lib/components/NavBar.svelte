<script lang="ts">
	import { Icon } from 'svelte-icon';
	import menu from '@mdi/svg/svg/menu.svg?raw';
	import backIcon from '@mdi/svg/svg/arrow-left.svg?raw';
	import refreshIcon from '@mdi/svg/svg/refresh.svg?raw';
	import logo from '$lib/logo.svg?raw';
	import { page } from '$app/state';

	import { MediaQuery } from 'svelte/reactivity';

	let { title, showMenu = $bindable(), hasmenu = true, rootPage = false } = $props();

	const isBrowser = new MediaQuery('display-mode: browser');
</script>

<div class="navbar bg-base-100 z-1 sticky top-0 h-16 shadow-sm">
	<div class="mx-auto flex h-16 w-full max-w-[1024px]">
		{#if isBrowser.current}
			<div class="flex-none place-self-center">
				<button
					class="btn btn-square btn-ghost"
					class:btn-disabled={rootPage}
					onclick={() => history.back()}
				>
					<Icon data={backIcon} />
				</button>
			</div>
			<div class="flex-none place-self-center">
				<button class="btn btn-square btn-ghost" onclick={() => location.reload()}>
					<Icon data={refreshIcon} />
				</button>
			</div>
		{/if}
		<div class="flex-none place-self-center">
			<a href={new URL('/browse', page.url.origin).toString()}>
				<Icon data={logo} width="128px" height="48px" />
			</a>
		</div>
		<div class="m-2 flex-1 place-self-center">
			<div class="hidden truncate text-ellipsis text-xl md:block">{title}</div>
		</div>
		<div class="flex-none place-self-center">
			{#if hasmenu}
				<button class="btn btn-square btn-ghost" onclick={() => (showMenu = true)}>
					<Icon data={menu} />
				</button>
			{/if}
		</div>
	</div>
</div>
