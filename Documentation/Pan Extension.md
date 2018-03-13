# Overview

PanExtension is a browser built using the WebExtensions framework. This framework is used for cross-browser extensions and is currently supported by Firefox, Chrome and Opera. For a general introduction to the WebExtensions framework, see the the [official docs](https://developer.mozilla.org/en-US/Add-ons/WebExtensions).

# Quick Start

First, clone the git repository on your local machine. The entirety of the PanExtension project lives under the PanExtension folder. To load the extension into your web browser, see the [Debugging](#Debugging) section below. The first entry point to PanExtension is the `process_page.js` file.  This script is ran on every page. It first checks that the current page is approved (white-listed) by the current user, and then processes that page's content if so. 

# Loading and Debugging

To debug the Pan extension using Firefox, open a new tab and navigate to the page `about:debugging`. Select the "enable add-on debugging" option, and then press the "Load Temporary Add-on" button. Browse to your PanExtension project, under the `addon` folder, and select the `manifest.json` file. The extension is now loaded and ready for debugging. 

To debug the Pan extension using Chrome, open a new tab and navigate to the page `chrome://extensions`. Ensure that the "Developer mode" checkbox is selected, and then press the "Load unpacked extension..." button. Navigate to the top-level directory of PanExtension and select it. *Note: this hasn't been tested, these instructions were ripped from [the Chrome docs](https://developer.chrome.com/extensions/getstarted)*.

# Building and Development

### Prerequisites
* NPM package management tool.

### Background
Pan relies on Node as well as third-party libraries to do some of it's initial client-side processing. WebExtensions do not easily support third-party libraries, so the utilization of [WebPack](https://webpack.js.org/concepts/) is necessary to bundle these modules into Pan. This method is [officially endorsed](https://github.com/mdn/webextensions-examples/tree/master/webpack-modules) by Mozilla, although alternative solutions exist. 

### Development 
After cloning the repository, run the command `npm install` to install the required modules specified by the `package.json` file. All the source code exists in the `PanExtension/src/` folder, of which the main core of the application is the `process_page.js` file. 

### Architecture Explained
The PanExtension project has a number of submodules that define various behavior. These submodules are outlined below:

* **Page Processing**

   The main logic of processing a page occurs in the `process_page.js` file. When the application is built, this file is packed with the required modules through usage of [WebPack](https://webpack.js.org/concepts/), which is compiled into the `out/app.js` file. This script is responsible for the actual processing of the page - collecting article data, sending it to the server and updating the page as necessary. 
   
* **Popup Menu**

    The popup menu actions are defined in the `src/popup_menu` folder. The popup menu consists of some HTML, CSS and JS files that dicatate layout, stylization and actions. The heart of this logic lies in the `popup_actions.js` file, which attaches listeners to the components of the menu via identifying buttons by a unique class name. You might be saying "well, that's stupid. Why would you not identify buttons via an ID?" That's a great question, but I could not for the life of me get that to work. Even the [official documentation](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Your_second_WebExtension) uses unique class names to identify components. Moving forward, when an action is detected, the `popup_actions.js` file will send a message indicating the button name that was pressed. This message is received by the `background_script.js` file, which then executes the action as necessary. 

### Building
When changes are made, the project can be built by running `npm run build` from the `PanExtenstion/` folder. From here, the [WebPack](https://webpack.js.org/concepts/) tool will package the application and build into the `PanExtension/addon/out/` folder. The `manifest.json` file defines what scripts from the `out` folder are loaded in the browser extension. To load the extension in your browser, please refer to the [Loading and Debugging](#Loading-and-Debugging) section.
