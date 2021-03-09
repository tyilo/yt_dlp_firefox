import svelte from "rollup-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";

export default {
  base: '',
  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
      emitCss: false,
    }),
  ],
};
