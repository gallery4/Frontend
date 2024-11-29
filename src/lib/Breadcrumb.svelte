<script lang="ts">
	import { Accordion, AccordionItem, Container, ListGroup, ListGroupItem } from "@sveltestrap/sveltestrap";
	import { createElementId } from "./utils";

    const {path, sortby, order} = $props();
    let data: BreadcrumbData[] = $state([]);

    $effect(() => {
		data = createBreadcrumb(path);

        $inspect(path)
        $inspect(data)
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

        for (let i = 0; i<output.length -1; i++){
            output[i].targetId = createElementId(output[i + 1].name)
        }

		return output;
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

<Accordion class="d-block d-sm-none mb-3" flush>
    {#if data.length > 0}
    <AccordionItem header={data[data.length-1].name}>
        <ListGroup flush >
            {#each data.reverse() as b, i}
            {#if i != 0}
                <ListGroupItem>
                    <a href="/browse/{b.path}?sortby={sortby}&order={order}#{createElementId(b.targetId)}">
                        {b.name}
                    </a>
                </ListGroupItem>
            {/if}
        {/each}
        </ListGroup>
    </AccordionItem>
    {/if}
</Accordion>