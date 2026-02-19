<script>
    let { dataName, ...rest } = $props();
    const storage = $derived(browser.storage.local.get({[dataName]: ""}));

    const saveFlags = async (event) => {
        await browser.storage.local.set({[event.target.dataset.name]: event.target.innerText});
    }

    const pasteClipboard = (event) => {
        event.preventDefault();
        document.execCommand('insertText', false, event.clipboardData.getData("text"))
    }
</script>

{#await storage then items}
    <span data-name={dataName} {...rest} spellcheck='false' contenteditable='true' oninput={saveFlags} onpaste={pasteClipboard}>{items[dataName]}</span>
{/await}

<style>
    span {
        display: inline-block;
        border: 1px solid black;
        word-wrap: break-word;
        word-break: break-word;
    }

    span:empty::before {
        content: '\200B';
    }

    span:hover {
        cursor: text;
    }
</style>
