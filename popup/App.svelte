<!-- Import the SpanWithTitle component from a separate file -->
<script>
  import SpanWithTitle from "./SpanWithTitle.svelte";

  // Initialize data with sample or fetched files
  let data = null;
  async function init() {
    if (window.browser) {
      // Fetch data using browser.runtime.sendMessage in a browser extension context
      data = await browser.runtime.sendMessage({
        type: "popupOpen",
      });
    } else {
      // For testing: Simulate data if browser API is not available
      data = {
        files: [
          // Sample file 1
          {
            url: "https://www.reddit.com/r/funny/comments/m14siw/double_jump/",
            status: "done",
            viewed: true,
            thumbnail: "https://external-preview.redd.it/...",
            title: "Double jump",
            path: "/home/tyilo/Downloads/Double jump-ujf0z2ldqzl61.mp4",
            filename: "Double jump-ujf0z2ldqzl61.mp4",
          },
          // Sample file 2 with an error
          {
            url: "https://example.org/",
            status: "error",
            viewed: false,
            error: "ERROR: Unsupported URL: https://example.org\n",
          },
          // Sample file 3 in downloading state
          {
            url: "https://www.reddit.com/r/Damnthatsinteresting/...",
            status: "downloading",
            viewed: false,
          },
        ],
      };
    }

    // Reverse the order of files for display
    data.files.reverse();
  }

  // Initialize and wait for data to be fetched or simulated
  const promise = init();

  // Function to open a file using browser.runtime.sendMessage
  async function openFile(file) {
    await browser.runtime.sendMessage({
      type: "openFile",
      path: file.path,
    });
  }

  // Function to show file content using browser.runtime.sendMessage
  async function showFile(file) {
    await browser.runtime.sendMessage({
      type: "showFile",
      path: file.path,
    });
  }
</script>

<!-- Popup container -->
<div class="container">
  {#await promise}
    <p>Loading...</p>
  {:then}
    {#if !data.helperWorking}
      <!-- Error message if communication with helper fails -->
      <div class="center">
        <h2>Can't communicate with helper</h2>
        <p>For installation instructions, see <a href="https://github.com/Tyilo/yt_dlp_firefox">here</a>.</p>
      </div>
    {:else if data.files.length === 0}
      <!-- No files downloaded -->
      <h2 class="center">No files downloaded</h2>
    {:else}
      <!-- Display downloaded files in a table -->
      <table>
        <tbody>
          {#each data.files as file}
            <tr>
              <td
                class="file status-{file.status}"
                class:viewed={file.viewed}
                on:click={openFile(file)}
              >
                <figure>
                  <img src={file.thumbnail} alt="" />
                </figure>
                <span class="title">
                  <!-- Display title with potential fallback to URL -->
                  <SpanWithTitle>{file.title || file.url}</SpanWithTitle>
                </span>
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
                    <!-- Show button if file status is "done" -->
                    <button
                      type="button"
                      on:click={(e) => {
                        e.stopPropagation();
                        showFile(file);
                      }}>Show</button>
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

<!-- Styling -->
<style>
  /* Global styles for the entire page */
  :global(html, body) {
    width: 400px;
    min-height: 100px;
    margin: 0;
    overflow: hidden;
  }

  /* Table styling */
  table {
    border-collapse: collapse;
    border-style: hidden;
    width: 100%;
    height: 100%;
  }

  /* Table row border */
  tr {
    border-bottom: 1px black solid;
  }

  /* Styling for individual file items */
  .file {
    height: 50px;
    display: grid;
    grid:
      "thumbnail title    actions" 1fr
      "thumbnail subtitle actions" 1fr
      / 50px 1fr auto;
  }

  /* Styling for downloaded and viewed files */
  .file.status-done:not(.viewed) {
    background-color: #cfc;
  }

  /* Styling for files with errors */
  .file.status-error {
    background-color: #fcc;
  }

  /* Background color on hover */
  .file:hover {
    background-blend-mode: multiply;
    background-image: linear-gradient(0deg, #ccc, #ccc);
  }

  /* Styling for file thumbnail */
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

  /* Styling for thumbnail image */
  .file img {
    grid-area: img;
    justify-self: center;
    align-self: center;
    max-height: 45px;
    max-width: 45px;
  }

  /* Styling for file title */
  .file .title {
    grid-area: title;
  }

  /* Styling for file subtitle (status or error) */
  .file .subtitle {
    grid-area: subtitle;
    color: #555;
  }

  /* Styling for span elements */
  .file span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    align-self: center;
  }

  /* Styling for file actions */
  .file .actions {
    grid-area: actions;
    align-self: center;
    justify-self: center;
  }

  /* Center alignment styles */
  .center, .center * {
    text-align: center;
  }
</style>
