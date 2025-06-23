# yt-dlp downloader for Firefox

A Firefox browser extension for downloading media with [`yt-dlp`](https://github.com/yt-dlp/yt-dlp).

## Installation

Install the extension from [here](https://addons.mozilla.org/en-US/firefox/addon/yt-dlp-downloader/).

Then clone this repository and run `make install INSTALL_DIR=$INSTALL_DIR` to install the required helper based on your browser:

| Browser                                                                                                                                        | `$INSTALL_DIR`           |
|:-----------------------------------------------------------------------------------------------------------------------------------------------|:-----------------------|
| [Firefox](https://support.mozilla.org/en-US/kb/install-firefox-linux#w_install-firefox-deb-package-for-debian-based-distributions-recommended) | ~/.mozilla         |
| Firefox Developer Edition                                                                                                                      | ~/.mozilla         |
| Firefox Nightly                                                                                                                                | ~/.mozilla         |
| [LibreWolf](https://librewolf.net/installation/debian/)                                                                                        | ~/.librewolf       |
| [Mullvad](https://mullvad.net/en/download/browser/linux)                                                                                       | ~/.mullvad-browser |

Note that this is assuming that you have downloaded your browser through a Debian repository or similar manager.

### Tor Browser Installation

First, run the following target:

```
make install-tor
```

If the path to your Tor Browser distribution's native messaging hosts lies elsewhere,
you will need to specify the `TOR_INSTALL_DIR` make variable like so:

```
make install-tor TOR_INSTALL_DIR=$TOR_INSTALL_DIR
```

Then, go to the Preferences menu in your browser at `about:addons` for the yt-dlp
downloader extension and paste the following flag under **yt-dlp flags**:

```
--proxy "socks5h://127.0.0.1:9150"
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