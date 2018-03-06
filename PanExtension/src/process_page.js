var $ = require("jquery");
var extractor = require('unfluff');
var server_address = "http://127.0.0.1:8000/";
var http_request = new XMLHttpRequest();
var request_timeout = 1000 * 10;
var user_page_key = "userpages";

$( document ).ready(function() 
{
	validate_browser();
	get_user_pages();
});

function get_user_pages()
{
	var on_storage_failure = function() 
	{
		// TODO red icon, display to user
		console.log("storage error occured");
	}

	var on_storage_success = function(result) 
	{
		if(current_page_valid(result))
		{
			start_page_processing();
		}
	}

	var storage_request = chrome.storage.local.get(user_page_key);
	storage_request.then(on_storage_success, on_storage_failure);	
}

function current_page_valid(user_pages)
{
	console.log("current page valid being called");
	console.log(user_pages);
	return false;
}

function start_page_processing()
{
	change_icon("yellow");
	var article_text = extract_text();
	request_wikilinks(article_text);
}

function extract_text()
{
	var html = document.documentElement.innerHTML;
	data = extractor(html);
	return data.text;
}

function request_wikilinks(article_text)
{
	http_request.open('PUT', server_address + "wikilinks/", true);
	http_request.setRequestHeader("Content-Type", "application/json");
	http_request.timeout = request_timeout;
	http_request.onreadystatechange = handle_server_response;
	http_request.ontimeout = handle_server_timeout;
	
	http_request.send(JSON.stringify({URL : window.location.href, Content : article_text}));
}

function handle_server_response()
{
	if(http_request.readyState != XMLHttpRequest.DONE)
	{
		return;
	}

	if(http_request.status != 200)
	{
		// TODO red icons with message to user
		console.log("Pan server response: " + http_request.status);
		change_icon("grey");
		return;
	}
	
	console.log("Server replied: " + http_request.responseText);
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
	if(http_request === false)
	{
		console.log("Browser does not support XMLHttpRequest");
		throw "Unsupported browser";
	}
}