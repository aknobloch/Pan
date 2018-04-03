var $ = require("jquery");
var extractor = require("unfluff");
var server_address = "http://aarondevelops.ddns.net:8000/";
var http_request = new XMLHttpRequest();
var request_timeout = 1000 * 10;
var user_page_key = "userpages";

$( document ).ready(function() 
{
	validate_browser();
	change_icon("grey");
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
	return new Promise((resolve, reject) =>
	{
		change_icon("yellow");
		
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
		change_icon("grey");
		return;
	}
	
	wiki_links = JSON.parse(http_request.responseText);
	insert_links(wiki_links);

	change_icon("green");
}

function insert_links(wiki_links)
{
	$('*').each(function () 
	{
		var current_element = $(this);

		// ignore parent nodes
		if(current_element.children().length > 0)
		{
			return;
		}

		if(is_invalid_tag(current_element))
		{
			return;
		}

		var element_text = current_element.text();
		// ignore non-paragraph elements with minimal text - these are likely not
		// content. a similar approach is used via the unfluff lib as well
		if(current_element.prop("tagName").toLowerCase() !== "p" && element_text.length < 50)
		{
			return;
		}

		for(name in wiki_links) 
		{
			var name_pattern = "\\b(" + name + ")\\b"
			var name_match = new RegExp(name_pattern, 'g');
			var link = get_pan_link(name, wiki_links[name]);

			element_text = element_text.replace(name_match, link);
		}

		current_element.html(element_text);
	});
}

function get_pan_link(name, link)
{
	return "<a href=\"" + link + "\"  style=\"color:green\"  target=\"_blank\">" + name + "</a>";
}

function is_invalid_tag(element)
{
	var tag_name = element.prop("tagName").toLowerCase();

	return  tag_name === "h1" || 
			tag_name === "h2" || 
			tag_name === "h3" || 
			tag_name === "h4" ||
			tag_name === "h5" ||
			tag_name === "head" ||
			tag_name === "title" ||
			tag_name === "a" ||
			tag_name === "style" ||
			tag_name === "script" ||
			tag_name === "noscript";
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