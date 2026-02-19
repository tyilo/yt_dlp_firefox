<script>
	let { children } = $props();
	let span = $state();
	let title = $derived(span && span.textContent);
</script>

<span bind:this={span} title={title}>
	{@render children()}
</span>
