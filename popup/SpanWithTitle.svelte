<script>
  // Declare a variable to hold a reference to the <span> element
  let span;

  // Computed property that updates the 'title' based on the span's text content
  $: title = span && span.textContent;
</script>

<!-- Create a <span> element and bind it to the 'span' variable using 'bind:this' -->
<span bind:this={span} title={title}>
  <!-- Render the content within the <slot> element -->
  <slot></slot>
</span>
