
browser.runtime.onMessage.addListener((sentMessage, sender) =>
{
	if( ! sentMessage.changeIcon)
	{
		return;
	}

	set_icon(sentMessage.changeIcon, sender.tab.id);
});

function set_icon(color, tab_id)
{
	icon = 
	{
		path : {
			16: "res/pan_logo_" + color + "_16.png",
			32: "res/pan_logo_" + color + "_32.png"
		},
		tabId : tab_id
	}

	browser.browserAction.setIcon(icon);
}
