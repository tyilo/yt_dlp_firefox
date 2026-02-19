<script>
  import SpanWithTitle from "./SpanWithTitle.svelte";

  let data = $state(null);
  async function init() {
    if (window.browser) {
      data = await browser.runtime.sendMessage({
        type: "popupOpen",
      });
    } else {
      // For testing
      data = {
        files: [
          {
            url: "https://www.reddit.com/r/funny/comments/m14siw/double_jump/",
            status: "done",
            viewed: true,
            thumbnail:
              "https://external-preview.redd.it/5njfzS79mgrmZQ2rcgKv3SKFueNLnhX-dxWSkZFpSMY.png?format=pjpg&auto=webp&s=08d011435cf2db26227d695da198d4f04e119aaf",
            title: "Double jump",
            path: "/home/tyilo/Downloads/Double jump-ujf0z2ldqzl61.mp4",
            filename: "Double jump-ujf0z2ldqzl61.mp4",
          },
          {
            url: "https://example.org/",
            status: "error",
            viewed: false,
            error: "ERROR: Unsupported URL: https://example.org\n",
          },
          {
            url:
              "https://www.reddit.com/r/Damnthatsinteresting/comments/m15cmh/this_aquarium_allows_the_kids_to_view_the_fish/",
            status: "downloading",
            viewed: false,
          },
        ],
      };
    }

    data.files.reverse();
  }

  const promise = init();

  async function openFile(file) {
    await browser.runtime.sendMessage({
      type: "openFile",
      path: file.path,
    });
  }

  async function showFile(file) {
    await browser.runtime.sendMessage({
      type: "showFile",
      path: file.path,
    });
  }
</script>

<div class="container">
  {#await promise}
    <p>Loading...</p>
  {:then}
    {#if !data.helperWorking}
      <div class="center">
        <h2>Can't communicate with helper</h2>
      <p>
        For installation instructions, see <a
          href="https://github.com/Tyilo/yt_dlp_firefox">here</a
        >.
      </p>
      </div>
    {:else if data.files.length === 0}
      <h2 class="center">No files downloaded</h2>
    {:else}
      <table>
        <tbody>
          {#each data.files as file}
            <tr>
              <td
                class="file status-{file.status}"
                class:viewed={file.viewed}
                onclick={openFile(file)}
              >
                <figure>
                  <img src={file.thumbnail} alt="" />
                </figure>
                <span class="title">
                  <SpanWithTitle>{file.title || file.url}</SpanWithTitle></span
                >
                <span class="subtitle">
                  <SpanWithTitle>
                    {#if file.status === "downloading"}
                      Downloading...
                    {:else if file.status === "done"}
                      {file.filename}
                    {:else if file.status === "error"}
                      Error: {file.error}
                    {/if}
                  </SpanWithTitle>
                </span>
                <div class="actions">
                  {#if file.status === "done"}
                    <button
                      type="button"
                      onclick={(e) => {
                        e.stopPropagation();
                        showFile(file);
                      }}>Show</button
                    >
                  {/if}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  {/await}
</div>

<style>
  :global(html, body) {
    width: 400px;
    min-height: 100px;
    margin: 0;
    overflow: hidden;
  }

  table {
    border-collapse: collapse;
    border-style: hidden;
    width: 100%;
    height: 100%;
  }

  tr {
    border-bottom: 1px black solid;
  }

  .file {
    height: 50px;
    display: grid;
    grid:
      "thumbnail title    actions" 1fr
      "thumbnail subtitle actions" 1fr
      / 50px 1fr auto;
  }

  .file.status-done:not(.viewed) {
    background-color: #cfc;
  }

  .file.status-error {
    background-color: #fcc;
  }

  .file:hover {
    background-blend-mode: multiply;
    background-image: linear-gradient(0deg, #ccc, #ccc);
  }

  .file figure {
    grid-area: thumbnail;
    height: 50px;
    width: 50px;
    margin: 0;
    display: grid;
    grid:
      "." 1fr
      "img" 45px
      "." 1fr
      / 1fr;
  }

  .file img {
    grid-area: img;
    justify-self: center;
    align-self: center;
    max-height: 45px;
    max-width: 45px;
  }

  .file .title {
    grid-area: title;
  }

  .file .subtitle {
    grid-area: subtitle;
    color: #555;
  }

  .file span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    align-self: center;
  }

  .file .actions {
    grid-area: actions;
    align-self: center;
    justify-self: center;
  }

  .center, .center * {
    text-align: center;
  }
</style>
