browser.runtime.onMessage.addListener((sentMessage) =>
{
	if(sentMessage.changeIcon)
	{
		set_icon(sentMessage.changeIcon)
	}
});


function set_icon(color)
{
	icon = 
	{
		path : {
			16: "res/pan_logo_" + color + "_16.png",
			32: "res/pan_logo_" + color + "_32.png"
		}
	}

	browser.browserAction.setIcon(icon);
}