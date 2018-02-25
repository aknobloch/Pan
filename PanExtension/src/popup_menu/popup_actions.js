document.addEventListener("click", function(e) 
{
	if (e.target.classList.contains("add-domain")) 
	{
    	browser.runtime.sendMessage({"menuItemPressed":"add-domain"}); // received by background service
	}

});