<script lang="ts">
	import { Icon, Input, InputGroup, InputGroupText } from '@sveltestrap/sveltestrap';
	import { createElementId } from './utils';
	import { goto } from '$app/navigation';

	const { path, sortby, order } = $props();
	let data: BreadcrumbData[] = $state(createBreadcrumb(path));

	let pathVal = $state(path);

	$effect(() => {
		data = createBreadcrumb(path);
		pathVal = path;
	});

	interface BreadcrumbData {
		name: string;
		path: string;
		targetId: string;
	}
	function createBreadcrumb(path?: string): BreadcrumbData[] {
		let output = [];
		output.push({
			name: '<root>',
			path: '',
			targetId: ''
		});

		if (!path) {
			return output;
		}

		let parts = path?.split('/');

		for (let i = 0; i < parts?.length; i++) {
			const prefix = parts.slice(0, i + 1).join('/');

			output.push({
				name: parts[i],
				path: prefix,
				targetId: ''
			});
		}

		for (let i = 0; i < output.length - 1; i++) {
			output[i].targetId = createElementId(output[i + 1].name);
		}

		return output;
	}

	function gotoBrowse(path: string) {
		const b = data.find((b) => b.path == path);
		if (b) goto(`/browse/${b.path}?sortby=${sortby}&order=${order}#${b.targetId}`);
	}
</script>

<nav aria-label="breadcrumb" class="d-none d-sm-block">
	<ol class="breadcrumb">
		{#each data as b, i}
			{#if i == data.length - 1}
				<li class="breadcrumb-item active" aria-current="page">
					{b.name}
				</li>
			{:else}
				<li class="breadcrumb-item">
					<a href="/browse/{b.path}?sortby={sortby}&order={order}#{b.targetId}">
						{b.name}
					</a>
				</li>
			{/if}
		{/each}
	</ol>
</nav>

<InputGroup class="d-sm-none mb-3">
	<InputGroupText><Icon name="sign-turn-right" /></InputGroupText>
	<Input type="select" bind:value={pathVal} onchange={() => gotoBrowse(pathVal)}>
		{#each data.reverse() as b}
			<option value={b.path}>{b.name}</option>
		{/each}
	</Input>
</InputGroup>
