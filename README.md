# yt-dlp downloader for Firefox

Enhance your Firefox browsing experience with the yt-dlp downloader extension. Seamlessly download media using [`yt-dlp`](https://github.com/yt-dlp/yt-dlp), a powerful alternative to the traditional YouTube downloader.

## Installation

1. **Install the Extension**: Visit the [Firefox Add-ons page](https://addons.mozilla.org/en-US/firefox/addon/yt-dlp-downloader/) and install the yt-dlp downloader extension.

2. **Helper Installation**:

   **Linux**:
   - After installing the extension, clone this repository.
   - Run the command `make install` to install the required helper.

   **Windows**:
   - After instslling the extension, clone this repository.
   - Navigate to the `windows_helper_installer` folder and double-click `SETUP.bat`.
   - For detailed instructions on installing the Windows helper, refer to the [README.md](https://github.com/iron4umx/yt_dlp_firefox/blob/master/windows_helper_installer/README.md) file inside the `windows_helper_installer` folder.

For additional information on the helper installation process, porting instructions, and other details, explore the [yt-dlp Firefox Helper for Windows Wiki](https://github.com/iron4umx/yt_dlp_firefox/wiki).

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
