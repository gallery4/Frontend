<script lang="ts">
	import { createElementId } from "./utils";

    const {path, sortby, order} = $props();
    let breadcrumbData: BreadcrumbData[] = $state([]);

    $effect(() => {
		breadcrumbData = createBreadcrumb(path);
	});

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
</script>

<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        {#each breadcrumbData as b, i}
            {#if i == breadcrumbData.length - 1}
                <li class="breadcrumb-item active" aria-current="page">
                    {b.name}
                </li>
            {:else}
                <li class="breadcrumb-item">
                    <a href="/browse/{b.prefix}?sortby={sortby}&order={order}#{createElementId(breadcrumbData[i + 1].name)}">
                        {b.name}
                    </a>
                </li>
            {/if}
        {/each}
    </ol>
</nav>