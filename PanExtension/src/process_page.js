var $ = require("jquery");
var extractor = require("unfluff");
var server_address = "http://127.0.0.1:8000/";
var http_request = new XMLHttpRequest();
var request_timeout = 1000 * 10;
var user_page_key = "userpages";

$( document ).ready(function() 
{
	validate_browser();
	get_user_pages()
		.then(validate_page)
		.then(start_page_processing)
		.then(request_wikilinks)
		.catch(on_error);
});

function get_user_pages()
{
	return chrome.storage.local.get(user_page_key);
}

function validate_page(user_pages)
{
	var user_approved_pages = user_pages.userpages;
	var current_domain = get_hostname(window.location.href);

	return new Promise((resolve, reject) => 
	{
		if(is_contained(current_domain, user_approved_pages))
		{
			resolve(true);
		}
		else
		{
			reject("Not a user white-listed domain.");
		}

	});
}

function start_page_processing(validated)
{
	change_icon("yellow");

	return new Promise((resolve, reject) =>
	{
		var article_text = extract_text();

		if(article_text && article_text.length > 250)
		{
			resolve(article_text);
		}
		else if(article_text)
		{
			reject("Article extracted less than sufficient threshold.");
		}
		else
		{
			reject("Article text could not be extracted.");
		}
	});
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
	
	// server response handled in the handle_server_response() method
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
	
	wiki_links = JSON.parse(http_request.responseText)

	for(name in wiki_links)
	{
		var link = wiki_links[name];
		replace_with_link(name, link);
	}

	change_icon("green");
}

function replace_with_link(name, link)
{
	var link_wrapper = "<a href=\"" + link + "\">" + name + "</a>";
	replaceText('*', name, link_wrapper, 'g');
}

function replaceText(selector, text, newText, flags) 
{
	var matcher = new RegExp(text, flags);
	$(selector).each(function () 
	{
		var $this = $(this);
		var replaced_text = "";
		if (!$this.children().length)
		{
		   $this.text($this.text().replace(matcher, newText));
		}
	});
}

// TODO abstract this function out
function is_contained(element, array)
{
	if(array == null)
	{
		return false;
	}

	for( var i = 0; i < array.length; i++)
	{
		if(array[i] === element)
		{
			return true;
		}
	}

	return false;
}

// TODO abstract this function out to ensure it is the same as what is checked in process_page
function get_hostname(full_page_url)
{
	var hostname;

    // find & remove protocol (http, ftp, etc.) and get hostname
    if (full_page_url.indexOf("://") > -1) 
    {
        hostname = full_page_url.split('/')[2];
    }
    else 
    {
        hostname = full_page_url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
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

function on_error(err)
{
	console.log(err); // TODO user feedback
}