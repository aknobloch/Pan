/*

*/
browser.runtime.onInstalled.addListener((details) =>
{
	if( details.reason != "install")
	{
		return;
	}

	browser.tabs.create({
	    url: chrome.runtime.getURL('./out/on_install_page.html')
	});
});