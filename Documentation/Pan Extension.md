# Overview

PanExtension is a browser built using the WebExtensions framework. This framework is used for cross-browser extensions and is currently supported by Firefox, Chrome and Opera. For a general introduction to the WebExtensions framework, see the the [official docs](https://developer.mozilla.org/en-US/Add-ons/WebExtensions).

# Quick Start

First, clone the git repository on your local machine. The entirety of the PanExtension project lives under the PanExtension folder. To load the extension into your web browser, see the [Debugging](#Debugging) section below. PanExtension is ran on all web pages. The first entry point to the scripts is the src/process_page.js file.

# Loading and Debugging

To debug the Pan extension using Firefox, open a new tab and navigate to the page `about:debugging`. Select the "enable add-on debugging" option, and then press the "Load Temporary Add-on" button. Browse to your PanExtension project, under the `addon` folder, and select the `manifest.json` file. The extension is now loaded and ready for debugging. 

To debug the Pan extension using Chrome, open a new tab and navigate to the page `chrome://extensions`. Ensure that the "Developer mode" checkbox is selected, and then press the "Load unpacked extension..." button. Navigate to the top-level directory of PanExtension and select it. *Note: this hasn't been tested, these instructions were ripped from [the Chrome docs](https://developer.chrome.com/extensions/getstarted)*.

# Building and Development

### Prerequisites
* NPM package management tool.

### Background
Pan relies on Node as well as third-party libraries to do some of it's initial client-side processing. WebExtensions do not easily support third-party libraries, so the utilization of [WebPack](https://webpack.js.org/concepts/) is necessary to bundle these modules into Pan. This method is [officially endorsed](https://github.com/mdn/webextensions-examples/tree/master/webpack-modules) by Mozilla, although alternative solutions exist. 

### Development 
After cloning the repository, run the command `npm install` to install the required modules specified by the `package.json` file. All the source code exists in the `PanExtension/src/` folder, of which the main entry point to the application is the `process_page.js` file. 

### Building
When changes are made, the project can be built by running `npm run build` from the `PanExtenstion/` folder. From here, the [WebPack](https://webpack.js.org/concepts/) tool will package the application and build into the `PanExtension/addon/out/` folder. The `manifest.json` file defines what scripts from the `out` folder are loaded in the browser extension. To load the extension in your browser, please refer to the [Loading and Debugging](#Loading-and-Debugging) section.
