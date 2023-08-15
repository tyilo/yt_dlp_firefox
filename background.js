// Variables to track downloading progress and new files
let downloading = 0; // Number of downloads in progress
let newFiles = 0; // Number of new files downloaded

// Array to store downloaded file information
const files = [];

// Function to get the last element of an array
function last(arr) {
  return arr[arr.length - 1];
}

// Function to update badge text based on download status
async function updateBadge() {
  let text = "";
  if (downloading) {
    text = "..."; // Display "..." while downloads are in progress
  } else if (newFiles) {
    text = `${newFiles}`; // Display the count of new files
  }
  await browser.browserAction.setBadgeText({
    text: text,
  });
}

// Function to send a message to the native messaging host
async function sendNativeMessage(message) {
  return await browser.runtime.sendNativeMessage("yt_dlp_firefox", message);
}

// Flag to indicate whether the helper is working
let helperWorking = false;

// Function to test the functionality of the helper
async function testHelper() {
  try {
    // Send a test message to the helper and get the response
    const response = await sendNativeMessage({
      action: "test",
    });

    // Update the 'helperWorking' flag based on the response
    helperWorking = response["success"];
  } catch (e) {
    // In case of an error, set 'helperWorking' to false
    helperWorking = false;
  }

  // Return the status of the helper (working or not)
  return helperWorking;
}

// Test the helper's functionality
testHelper();

// Listen for messages from the extension
browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  switch (message.type) {
    case "popupOpen":
      // Reset newFiles counter and mark files as viewed after a short delay
      newFiles = 0;
      setTimeout(() => {
        for (let file of files) {
          file.viewed = true;
        }
      }, 100);

      // Update badge and return data
      return (async () => {
        await updateBadge();
        return { files: files, helperWorking: await testHelper() };
      })();

    case "openFile":
      // Ensure the message.path is properly sanitized before using it
      const sanitizedOpenPath = sanitizePath(message.path);

      // Send the sanitized path to the native messaging host
      sendNativeMessage({
        action: "open",
        path: sanitizedOpenPath,
      });
      break;

    case "showFile":
      // Ensure the message.path is properly sanitized before using it
      const sanitizedShowPath = sanitizePath(message.path);

      // Send the sanitized path to the native messaging host
      sendNativeMessage({
        action: "show",
        path: sanitizedShowPath,
      });
      break;
  }
});

// Sanitize a file path to prevent directory traversal attacks
function sanitizePath(path) {
  // Normalize the path to remove any duplicate slashes and resolve any ".." segments
  const normalizedPath = path.replace(/\/+/g, '/').replace(/(^|\/)(?:\.\/)+/g, '$1');

// Dynamically determine the allowed folder path based on extension installation
const allowedFolder = browser.runtime.getURL("popup-dist/");

  // Ensure the path is within the allowed folder
  if (!normalizedPath.startsWith(allowedFolder)) {
    throw new Error("Invalid file path");
  }

  return normalizedPath;
}



// Function to initiate the download process for a given URL
async function download(url) {
  // Check if the helper is working, if not show a notification
  if (!await testHelper()) {
    await browser.notifications.create(null, {
      type: "basic",
      title: "yt-dlp",
      message: "Couldn't communicate with helper program!\nHave you installed it?",
      iconUrl: "icon.svg",
    });
    return;
  }

  // Create a file object to track the download status
  const file = {
    url: url,
    status: "downloading",
    viewed: false,
  };
  files.push(file); // Add the file to the files array
  downloading++; // Increment the downloading count

  // Update badge and display download notification
  await updateBadge();

  // Create a notification to indicate the start of the download
  const notificationId = await browser.notifications.create(null, {
    type: "basic",
    title: "yt-dlp",
    message: `Downloading ${url}`,
    iconUrl: "icon.svg",
  });

  // Send a native message to initiate the download and capture the response
  let response;
  try {
    response = await sendNativeMessage({
      action: "download",
      url: url,
    });
  } catch(e) {
    // Handle exceptions during communication with the helper
    response = {
      success: false,
      error: `Got exception communicating with helper: ${e}`,
    };
  }

  // Clear the download notification
  await browser.notifications.clear(notificationId);

  let message;
  if (response.success) {
    // Update file information on successful download
    file.status = "done"; // Update file status to "done"
    file.path = response.path; // Update file path
    file.filename = last(response.path.split("/")); // Extract and store the filename
    file.thumbnail = response.thumbnail; // Store the thumbnail information
    file.title = response.title; // Update file title

    // Create a notification to indicate successful download
    message = `Downloaded ${response.title}`;
  } else {
    // Update file information on download error
    file.status = "error"; // Update file status to "error"
    file.error = response.error; // Store the error message

    // Create a notification to indicate download error
    message = `Error: ${response.error}`;
  }

  // Create a notification to indicate download success/error
  await browser.notifications.create(null, {
    type: "basic",
    title: "yt-dlp",
    message: message, // Display the appropriate message
    iconUrl: "icon.svg",
  });

  // Update counters and badge after download completion
  downloading--; // Decrement downloading count
  newFiles++; // Increment new files count
  await updateBadge();
}

// Create a context menu item for downloading with yt-dlp
browser.contextMenus.create({
  id: "download",
  title: "Download with yt-dlp",
  contexts: ["all"],
  icons: {
    16: "icon.svg",
  },
});

// Listen for context menu item click event
browser.contextMenus.onClicked.addListener(async (info, tab) => {
  // Check if the context menu item was clicked on a link or page
  if (info.linkUrl) {
    // If clicked on a link, initiate download with the link URL
    await download(info.linkUrl);
  } else {
    // If clicked on a page, initiate download with the page URL
    await download(info.pageUrl);
  }
});
