# yt-dlp downloader for Firefox

A Firefox browser extension for downloading media with [`yt-dlp`](https://github.com/yt-dlp/yt-dlp).

## Installation

Install the extension from [here](https://addons.mozilla.org/en-US/firefox/addon/yt-dlp-downloader/).

Then clone this repository and run `make install` to install the required helper, if you use windows, go inside the folder: `windows_helper_installer` and double click: `SETUP.bat` for more information on installing the windows helper read the [README.md](https://github.com/iron4umx/yt_dlp_firefox/blob/master/windows_helper_installer/README.md) file inside the `windows_helper_installer` folder, and for further information on the helper and porting in general visit the [yt-dlp Firefox Helper for Windows Wiki](https://github.com/iron4umx/yt_dlp_firefox/wiki).

## Snap/flatpak permissions

In case of web browser installed via snap/flatpak there might be a problem with accessing resources outside of sandbox. If you won't be asked for permissions you can add them using command line via following command:

```
flatpak permission-set webextensions yt_dlp_firefox snap.firefox yes
```

To check current permissions:

```
flatpak permission-show snap.firefox
```

you should see following:

| Table            | Object            | App          | Permissions  | Data |
| :--------------- |:----------------- | :----------- | :----------- | :--- |
| webextensions    | yt_dlp_firefox    | snap.firefox | yes          | 0x00 |


to debug issues in snap/flatpak permissions start browser like this:

```
MOZ_LOG=NativeMessagingPortal:5 snap run firefox
```
