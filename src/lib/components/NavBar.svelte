<script lang="ts">
	import { Icon } from 'svelte-icon';
	import menu from '@mdi/svg/svg/menu.svg?raw';
	import backIcon from '@mdi/svg/svg/arrow-left.svg?raw';
	import upIcon from '@mdi/svg/svg/arrow-up.svg?raw';
	import refreshIcon from '@mdi/svg/svg/refresh.svg?raw';
	import logo from '$lib/logo.svg?raw';
	import { page } from '$app/state';

	import { MediaQuery } from 'svelte/reactivity';
	import { goto } from '$app/navigation';
	import type { Snippet } from 'svelte';

	interface Props {
		showMenu?: boolean;
		hasMenu?: boolean;
		rootPage?: boolean;
		hasUp?: boolean;
		upUrl?: URL | string;
		children?: Snippet;
	}

	let {
		showMenu = $bindable(),
		hasMenu = true,
		rootPage = false,
		upUrl = undefined,
		hasUp = true,
		children = undefined
	}: Props = $props();

	const isBrowser = new MediaQuery('display-mode: browser');
</script>

<div class="navbar bg-base-100 z-1 sticky top-0 h-16 shadow-sm">
	<div class="mx-auto flex h-16 w-full max-w-[1024px]">
		{#if !isBrowser.current}
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
		<div class="flex-1 grow place-self-center overflow-hidden">
			{@render children?.()}
		</div>
		<div class="flex-none place-self-center">
			{#if hasUp}
				<button
					class="btn btn-square btn-ghost"
					class:btn-disabled={upUrl == undefined}
					onclick={() => {
						if (upUrl) goto(upUrl);
					}}
				>
					<Icon data={upIcon} />
				</button>
			{/if}
		</div>
		<div class="flex-none place-self-center">
			{#if hasMenu}
				<button class="btn btn-square btn-ghost" onclick={() => (showMenu = true)}>
					<Icon data={menu} />
				</button>
			{/if}
		</div>
	</div>
</div>
