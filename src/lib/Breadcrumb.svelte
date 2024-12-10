<script lang="ts">
	import { Button, Icon, Input, InputGroup, InputGroupText } from '@sveltestrap/sveltestrap';
	import { createElementId } from './utils';
	import { goto } from '$app/navigation';

	const { path } = $props();
	const data: BreadcrumbData[] = $derived(createBreadcrumb(path));

	let pathVal = $state(path);

	$effect(() => {
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
		if (b) goto(`/browse/${b.path}#${b.targetId}`);
	}
</script>

<InputGroup>
	<InputGroupText><Icon name="sign-turn-right" /></InputGroupText>
	<Button onclick={() => gotoBrowse(data[0].path)} disabled={data.length == 1}>
		<Icon name="slash" />
	</Button>
	<Input type="select" bind:value={pathVal} onchange={() => gotoBrowse(pathVal)}>
		{#each data as b}
			<option value={b.path}>{b.name}</option>
		{/each}
	</Input>
	<Button onclick={() => gotoBrowse(data[data.length - 2].path)} disabled={data.length == 1}>
		<Icon name="arrow-90deg-up" />
	</Button>
</InputGroup>
