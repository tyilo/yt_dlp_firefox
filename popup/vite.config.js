import svelte from "rollup-plugin-svelte";        // Import the Svelte Rollup plugin
import sveltePreprocess from "svelte-preprocess"; // Import the Svelte preprocessor

export default {
  base: '',                                      // The base path for your application (empty in this case)
  plugins: [
    svelte({
      preprocess: sveltePreprocess(),             // Apply Svelte preprocessor to your components
      emitCss: false,                             // Do not emit CSS as separate files (it will be included in JS)
    }),
  ],
};
