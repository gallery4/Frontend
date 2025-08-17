<script lang="ts">
	import { redirect } from '@sveltejs/kit';

	redirect(307, "/browse")
</script>

<svelte:head>
	<title>Gallery</title>
</svelte:head>

<div class="container">
	<p>click here to <a href="/browse">browse</a> if the browser does not redirect.</p>
</div>
