# Overview

PanExtension is a browser built using the WebExtensions framework. This framework is used for cross-browser extensions and is currently supported by Firefox, Chrome and Opera. For a general introduction to the WebExtensions framework, see the the [official docs](https://developer.mozilla.org/en-US/Add-ons/WebExtensions).

# Quick Start

First, clone the git repository on your local machine. The entirety of the PanExtension project lives under the PanExtension folder. To load the extension into your web browser, see the [Debugging](# Debugging) section below. PanExtension is ran on all web pages. The first entry point to the scripts is the scripts/process_page.js file.

# Debugging

To debug the Pan extension using Firefox, open a new tab and navigate to the page `about:debugging`. Select the "enable add-on debugging" option, and then press the "Load Temporary Add-on" button. Browse to your PanExtension project, and select the `manifest.json` file. The extension is now loaded and ready for debugging. 

To debug the Pan extension using Firefox, open a new tab and navigate to the page `chrome://extensions`. Ensure that the "Developer mode" checkbox is selected, and then press the "Load unpacked extension..." button. Navigate to the top-level directory of PanExtension and select it. *Note: this hasn't been tested, these instructions were ripped from [the Chrome docs](https://developer.chrome.com/extensions/getstarted)*.
