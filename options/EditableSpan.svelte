<script>
    export let dataName;
    const storage = browser.storage.local.get({[dataName]: ""});

    const saveFlags = async (event) => {
        await browser.storage.local.set({[event.target.dataset.name]: event.target.innerText});
    }

    const pasteClipboard = (event) => {
        event.preventDefault();
        document.execCommand('insertText', false, event.clipboardData.getData("text"))
    }
</script>

{#await storage}
{:then items}
    <span data-name={dataName} {...$$restProps} spellcheck='false' contenteditable='true' on:input={saveFlags} on:paste={pasteClipboard}>{items[dataName]}</span>
{/await}

<style>
    span {
        display: inline-block;
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