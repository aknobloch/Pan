document.addEventListener("click", function(e) 
{
	if (e.target.classList.contains("add-domain")) 
	{
		// received by the manage_domains background service
    	browser.runtime.sendMessage({changeDomains:"addDomain"});
    	window.close();
	}
	else if(e.target.classList.contains("manage-domains"))
	{
		window.location.replace("./manage_domains.html");
	}
	else if(e.target.classList.contains("help-page"))
	{
		window.location.replace("./help_page.html");
	}

});