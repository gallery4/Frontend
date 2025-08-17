<script lang="ts">
	import { createElementId } from '$lib/utils';
	import { goto } from '$app/navigation';

	import { Icon } from 'svelte-icon';
	import directoryUpIcon from '@mdi/svg/svg/folder-upload.svg?raw';
	import directoryIcon from '@mdi/svg/svg/folder.svg?raw';

	const { path } = $props();
	const data: BreadcrumbData[] = $derived(createBreadcrumb(path));

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

<ul class="menu">
	<li class="menu-title">Directory</li>
	<li>
		<details class="dropdown">
			<summary class="btn m-1"><Icon data={directoryUpIcon} /> Parents</summary>
			<ul class="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
				<ul class="menu">
					{#each data as b}
						<li>
							<button onclick={() => gotoBrowse(b.path)} disabled={data.length == 1}>
								<Icon data={directoryIcon} />
								{b.name}
							</button>
						</li>
					{/each}
				</ul>
			</ul>
		</details>
	</li>
</ul>
