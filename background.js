let downloading = 0;
let newFiles = 0;
const files = [];

function last(arr) {
  return arr[arr.length - 1];
}

async function updateBadge() {
  let text = "";
  if (downloading) {
    text = "...";
  } else if (newFiles) {
    text = `${newFiles}`;
  }
  await browser.browserAction.setBadgeText({
    text: text,
  });
}

async function sendNativeMessage(message) {
  return await browser.runtime.sendNativeMessage("youtube_dl_firefox", message);
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "popupOpen":
      newFiles = 0;
      setTimeout(() => {
        for (let file of files) {
          file.viewed = true;
        }
      }, 100);

      return (async () => {
        await updateBadge();
        return { files: files };
      })();

    case "openFile":
      sendNativeMessage({
        action: "open",
        path: message.path,
      });
      break;

    case "showFile":
      sendNativeMessage({
        action: "show",
        path: message.path,
      });
      break;
  }
});

async function download(url) {
  const file = {
    url: url,
    status: "downloading",
    viewed: false,
  };
  files.push(file);
  downloading++;

  await updateBadge();

  const notificationId = await browser.notifications.create(null, {
    type: "basic",
    title: "youtube-dl",
    message: `Downloading ${url}`,
    iconUrl: "icon.svg",
  });

  const response = await sendNativeMessage({
    action: "download",
    url: url,
  });

  await browser.notifications.clear(notificationId);

  let message;
  if (response.success) {
    file.status = "done";
    file.path = response.path;
    file.filename = last(response.path.split("/"));
    file.thumbnail = response.thumbnail;
    file.title = response.title;
    message = `Downloaded ${response.title}`;
  } else {
    file.status = "error";
    file.error = response.error;
    message = `Error: ${response.error}`;
  }

  await browser.notifications.create(null, {
    type: "basic",
    title: "youtube-dl",
    message: message,
    iconUrl: "icon.svg",
  });

  downloading--;
  newFiles++;
  await updateBadge();
}

browser.contextMenus.create({
  id: "download",
  title: "Download with youtube-dl",
  contexts: ["all"],
  icons: {
    16: "icon.svg",
  },
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.linkUrl) {
    download(info.linkUrl);
  } else {
    download(info.pageUrl);
  }
});
