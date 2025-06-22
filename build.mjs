import { build } from 'vite'
import svelte from "rollup-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";

async function buildAll (roots) {
    for (let root of roots) {
        await build({
            base: '',
            plugins: [
                svelte({
                    preprocess: sveltePreprocess(),
                    emitCss: false,
                }),
            ],
            root: root
        })
    }
}

buildAll(['popup', 'options'])