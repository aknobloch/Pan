document.addEventListener("click", function(e) 
{
	if (e.target.classList.contains("add-domain")) 
	{
    	browser.runtime.sendMessage({menuItemPressed:"addDomain"}); // received by background service
    	window.close();
	}

});