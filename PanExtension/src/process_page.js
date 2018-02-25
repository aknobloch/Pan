var $ = require("jquery");

$( document ).ready(function() {
    console.log("hello pan!")
	try
	{
		extractor = require('unfluff')
	}
	catch(err)
	{
		console.log(err.message)
		console.log("err")
	}
	console.log("require done")
	var html = document.documentElement.innerHTML
	console.log("html extracted")
	console.log(html)
	data = extractor(html)
	console.log("data extracted")
	console.log(data.text)
});