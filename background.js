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
  return await browser.runtime.sendNativeMessage("yt_dlp_firefox", message);
}

let helperWorking = false;
async function testHelper() {
  try {
    const response = await sendNativeMessage({
      action: "test",
    });
    helperWorking = response["success"];
  } catch (e) {
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
      title: "yt-dlp",
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
    title: "yt-dlp",
    message: `Downloading ${url}`,
    iconUrl: "icon.svg",
  });

  const defaultOptions = {
    'path': undefined,
    'flags': '',
    'wd': '~/Downloads',
  }
  const storage = await browser.storage.local.get(defaultOptions);
  if (storage['wd'].trim() === "") {
    storage['wd'] = defaultOptions['wd']
  }

  let response;
  try {
    response = await sendNativeMessage({
      action: "download",
      path: storage['path'],
      flags: storage['flags'],
      url: url,
      wd: storage['wd']
    });
  } catch(e) {
    response = {
      success: false,
      error: `Got exception communicating with helper: ${e}`,
    };
  }

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
    title: "yt-dlp",
    message: message,
    iconUrl: "icon.svg",
  });

  downloading--;
  newFiles++;
  await updateBadge();
}

const defaultOptions = {
  'browserAction': 'popup',
  'contextMenus': {
    'link': true,
    'page': true,
  }
}

browser.storage.local.get(defaultOptions, async (items) => {
  let popup;
  switch (items['browserAction']) {
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

  const contextMenus = items['contextMenus']
  for (let context of Object.keys(contextMenus)) {
    if (contextMenus[context]) {
      browser.contextMenus.create({
        id: context,
        title: "Download with yt-dlp",
        contexts: [context],
        icons: {
          16: "icon.svg",
        },
      });
    }
  }
})

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.linkUrl) {
    await download(info.linkUrl);
  } else {
    await download(info.pageUrl);
  }
});

browser.browserAction.onClicked.addListener(async (tab) => {
  await download(tab.url)
})
