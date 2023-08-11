# yt-dlp Firefox Helper Setup Utility (`SETUP.bat`)

The yt-dlp Firefox Helper Setup Utility is designed to simplify the installation, reinstallation, and uninstallation of the yt-dlp downloader for Firefox. This utility provides an interactive menu that guides you through the setup process and automates several steps for a seamless experience.

## Prerequisites

Before running the setup utility, make sure you have the following prerequisites installed:

1. **Administrator Privileges:** Ensure you are running the setup utility with administrator privileges.

2. **Python:** The setup utility requires Python to be installed on your system. If Python is not already installed, you can download and install it from the [Microsoft Store](https://www.microsoft.com/en-us/p/python/9p7qfqmjrfp7).

## Getting Started

1. Download the yt-dlp Firefox Helper files from the project repository.

2. Extract the downloaded files to a directory of your choice.

3. Run the `SETUP.bat` file by double-clicking on it. This script detects the current status of the yt-dlp Firefox Helper and offers options based on the detected status.

## Setup Options

The setup utility provides the following options based on the status of the yt-dlp Firefox Helper:

1. **Install yt-dlp Firefox Helper:** This option installs the yt-dlp Firefox Helper and configures the necessary settings.

2. **Uninstall yt-dlp Firefox Helper:** If the helper is installed, this option removes the yt-dlp Firefox Helper and cleans up related configurations.

3. **Reinstall yt-dlp Firefox Helper:** This option performs an uninstallation followed by a fresh installation of the yt-dlp Firefox Helper.

## Installation Steps

1. Choose the option to install the yt-dlp Firefox Helper.

2. Enter the installation directory for the helper. You can use the default directory or provide a custom path.

3. The setup utility will download the `yt-dlp.exe` executable and other required files.

4. The registry entry for Native Messaging Hosts will be updated to enable communication with the helper.

5. The installation directory will be added to the system's PATH environment variable.

6. The setup utility will display a completion message with instructions on the successful installation.

## Uninstallation Steps

1. Choose the option to uninstall the yt-dlp Firefox Helper.

2. The setup utility will remove the registry entry for Native Messaging Hosts.

3. The installation directory will be removed from the system's PATH environment variable.

4. The setup utility will display a completion message indicating that the helper has been uninstalled.

## Troubleshooting

If you encounter any issues during installation or uninstallation, please refer to the following troubleshooting steps:

- **Registry Entry Not Removed:** If the registry entry is not removed during uninstallation, you can manually delete it by navigating to `HKLM\SOFTWARE\Mozilla\NativeMessagingHosts` and deleting the `yt_dlp_firefox` key.

- **Installation Directory Not Removed from PATH:** If the installation directory is not removed from the system's PATH, you can manually remove it using the following command in the Command Prompt or PowerShell:

  ```batch
  setx PATH "%PATH:installation_directory_path=%" /M
