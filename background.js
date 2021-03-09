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

let helperWorking = false;
async function testHelper() {
  try {
    const response = await sendNativeMessage({
      action: "test",
    });
    helperWorking = response["success"];
  } catch (e) {
    console.error("AAAAA");
    console.error(e);
    helperWorking = false;
  }

  return helperWorking;
}

testHelper();

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
        return { files: files, helperWorking: await testHelper() };
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
  if (!await testHelper()) {
    await browser.notifications.create(null, {
      type: "basic",
      title: "youtube-dl",
      message: "Couldn't communicate with helper program!\nHave you installed it?",
      iconUrl: "icon.svg",
    });
    return;
  }

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

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.linkUrl) {
    await download(info.linkUrl);
  } else {
    await download(info.pageUrl);
  }
});
