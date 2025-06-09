# yt-dlp downloader for Firefox

A Firefox browser extension for downloading media with [`yt-dlp`](https://github.com/yt-dlp/yt-dlp).

## Installation

Install the extension from [here](https://addons.mozilla.org/en-US/firefox/addon/yt-dlp-downloader/).

Then clone this repository and run `make install INSTALL_DIR=$INSTALL_DIR` to install the required helper based on your browser:

| Browser                                                                                                                                        | $INSTALL_DIR           |
|:-----------------------------------------------------------------------------------------------------------------------------------------------|:-----------------------|
| [Firefox](https://support.mozilla.org/en-US/kb/install-firefox-linux#w_install-firefox-deb-package-for-debian-based-distributions-recommended) | $HOME/.mozilla         |
| Firefox Developer Edition                                                                                                                      | $HOME/.mozilla         |
| Firefox Nightly                                                                                                                                | $HOME/.mozilla         |
| [LibreWolf](https://librewolf.net/installation/debian/)                                                                                        | $HOME/.librewolf       |
| [Mullvad](https://mullvad.net/en/download/browser/linux)                                                                                       | $HOME/.mullvad-browser |

Note that this is assuming that you have downloaded your browser through a Debian repository or other package manager.

### Tor Browser Installation

```
make install-tor
```

This is assuming that you have installed the Tor Browser via the Debian package `torbrowser-launcher`.
If your path to the Tor Browser is elsewhere, you can run the above target like so:

```
make install-tor TOR_INSTALL_DIR=$TOR_INSTALL_DIR
```

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
