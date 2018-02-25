var $ = require("jquery");
var extractor = require('unfluff');
var server_address = "http://127.0.0.1:8000/";
var httpRequest = new XMLHttpRequest();

$( document ).ready(function() 
{
	validate_browser();
	validate_user_page();
	
	var article_text = extract_text();
	request_wikilinks(article_text);
	
});

function validate_user_page()
{
	// TODO: check to see if current page is allowed by user, throw exception if not
}

function extract_text()
{
	var html = document.documentElement.innerHTML;
	data = extractor(html);
	return data.text;
}

function request_wikilinks(article_text)
{
	httpRequest.open('PUT', server_address + "wikilinks/", false);
	httpRequest.setRequestHeader("Content-Type", "application/json");
	httpRequest.send(JSON.stringify({URL : window.location.href, Content : article_text}));

	if(httpRequest.status == 200)
	{
		console.log("Server replied: " + httpRequest.responseText);
	}
}

function validate_browser()
{
	// validate 
	if( ! httpRequest)
	{
		console.log("Browser does not support XMLHttpRequest");
		throw "Unsupported browser";
	}
}