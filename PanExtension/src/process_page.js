var $ = require("jquery");
var extractor = require('unfluff');
var server_address = "http://127.0.0.1:8000/";
var httpRequest = new XMLHttpRequest();
var request_timeout = 1000 * 10;

$( document ).ready(function() 
{
	validate_browser();
	validate_user_page();
	
	change_icon("yellow");
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
	httpRequest.open('PUT', server_address + "wikilinks/", true);
	httpRequest.setRequestHeader("Content-Type", "application/json");
	httpRequest.timeout = request_timeout;
	httpRequest.onreadystatechange = handle_server_response;
	httpRequest.ontimeout = handle_server_timeout;
	
	httpRequest.send(JSON.stringify({URL : window.location.href, Content : article_text}));
}

function handle_server_response()
{
	if(httpRequest.readyState != XMLHttpRequest.DONE)
	{
		return;
	}

	if(httpRequest.status != 200)
	{
		// TODO red icons with message to user
		console.log("Pan server response: " + httpRequest.status);
		change_icon("grey");
		return;
	}
	
	console.log("Server replied: " + httpRequest.responseText);
	change_icon("green");
}

function handle_server_timeout()
{
	// TODO: red icons with message to user
	change_icon("grey");
}

function change_icon(color)
{
	browser.runtime.sendMessage({"changeIcon" : color}); // received by background service
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