var $ = require("jquery")
var extractor = require('unfluff')

function extract_text()
{
	var html = document.documentElement.innerHTML
	data = extractor(html)
	return data.text
}

function handle_server_response()
{
	console.log("server replied")
}

$( document ).ready(function() {

	// TODO: check to see if current page is allowed by user
	console.log(extract_text())
})