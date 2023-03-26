# yt-dlp downloader for Firefox

A Firefox browser extension for downloading media with [`yt-dlp`](https://github.com/yt-dlp/yt-dlp).

## Installation

Install the extension from [here](https://addons.mozilla.org/en-US/firefox/addon/yt-dlp-downloader/).

Then clone this repository and run `make install` to install the required helper in user home directory.

If you want to install it as system wide application, then you need to execute installation with superuser rights, for example:

`sudo make install`

## Uninstallation
To remove from user home directory execute `make uninstall`

If you installed it as system wide, you need to run `sudo make uninstall`

## Configuration

By default yt-dlp is invoked by this script like this:

`yt-dlp --print-json -- $url` and result is placed in $HOME/Downloads

but it can be can be configured per user by manually creating file: `$HOME/.config/yt_dlp_firefoxrc`
following options are available:

download_directory - path where output will be stored

yt_dlp_options - yt-dlp path and options except url

For exmaple to download only mp3 from YouTube this file could look like this:

```
download_directory = /home/SOME_USER/Music
yt_dlp_options = yt-dlp -x --audio-format mp3 --print-json --
```

SOME_USER - needs to be adopted to particular user

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
