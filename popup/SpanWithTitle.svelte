<script>
	let span;
	$: title = span && span.textContent;
</script>

<span bind:this={span} title={title}>
	<slot></slot>
</span>
