<script>
    import EditableSpan from "./EditableSpan.svelte";

    const defaultOptions = {
        'browserAction': 'popup',
        'contextMenus': {
            'link': true,
            'page': true,
        }
    }
    

    document.addEventListener('DOMContentLoaded', () => {
        browser.storage.local.get(defaultOptions, (items) => {
            for (let checkbox of document.querySelectorAll('input[type=checkbox]')) {
                checkbox.checked = items[checkbox.name][checkbox.value];
            }
            for (let form of document.forms) {
                for (let radio of document.querySelectorAll(`#${form.id} > input[type=radio]`)) {
                    if (radio.value === items[form.id]) {
                        radio.checked = true;
                        break;
                    }
                }
            }
        })
    })

    const changePopup = async (event) => {
        await browser.storage.local.set({[event.target.name]: event.target.value}, async () => {
            let popup;
            switch (event.target.value) {
                case 'popup':
                    popup = null;
                    break;
                case 'download':
                    popup = '';
                    break;
                default:
                    return;
            }
            await browser.browserAction.setPopup({popup: popup})
        });
    }

    const toggleContextMenu = async  (event) => {
        const formId = event.target.name;
        defaultOptions[formId][event.target.value] = event.target.checked;
        await browser.storage.local.set({[formId]: defaultOptions[formId]}, async () => {
            if (event.target.checked) {
                await browser.contextMenus.create({
                    id: event.target.value,
                    title: 'Download with yt-dlp',
                    contexts: [event.target.value],
                    icons: {
                        16: 'icon.svg',
                    },
                });
            }
            else {
                await browser.contextMenus.remove(event.target.value);
            }
        });
    }

</script>

<div id='forms'>
    <form id='path'>
        yt-dlp path:<br><br>
        <EditableSpan dataName='path'></EditableSpan>
    </form>
    <form id='flags'>
        yt-dlp flags:<br><br>
        <EditableSpan dataName='flags'></EditableSpan>
    </form>

    <form id='wd'>
        Working directory:<br><br>
        <EditableSpan dataName='wd'></EditableSpan>
    </form>

    <form id='browserAction'>
        Browser action:<br><br>
        <input id='browserActionPopup' type='radio' name='browserAction' value='popup' on:change={changePopup}>
        <label for='browserActionPopup'> Open popup</label><br>
        <input id='browserActionDownload' type='radio' name='browserAction' value='download' on:change={changePopup}>
        <label for='browserActionDownload'> Run yt-dlp</label>
    </form>
    <form id='contextMenus'>
        Context menu contexts:<br><br>
        <input id='contextMenusLink' type='checkbox' name='contextMenus' value='link' on:change={toggleContextMenu}>
        <label for='contextMenusLink'> Link</label><br>
        <input id='contextMenusPage' type='checkbox' name='contextMenus' value='page' on:change={toggleContextMenu}>
        <label for='contextMenusPage'> Page</label>
    </form>
</div>

<style>
    :global(body, html) {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        font-weight: bold;
        height: 100%;
        justify-content: center;
        padding: 10px;
    }

    :global(input, span) {
        margin-left: 20px;
    }

    :global(span) {
        font-weight: normal;
        outline: none;
        padding: 1px 2px;
        width: 400px;
    }

    br {
        display: block;
        margin-top: 5px;
    }

    input {
        font-weight: bold;
    }

    #forms > *:not(:last-child) {
        padding-bottom: 20px;
    }
</style>
