browser.runtime.onMessage.addListener((sentMessage) =>
{
	console.log("received: ", sentMessage.menuItemPressed);
});