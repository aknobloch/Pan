var user_page_key = "userpages";

function get_user_pages()
{
	return browser.storage.local.get(user_page_key);
}

function show_whitelisted_domains(user_pages)
{
	var user_approved_pages = user_pages.userpages;
	var domain_table = document.getElementById("domains");

	if(user_approved_pages.length == 0)
	{
		remove_table(domain_table);
		return;
	}

	add_domains_to_table(user_approved_pages, domain_table);
}

function add_domains_to_table(domains, table)
{
	var domain_body = document.createElement("tbody");

	for(i = 0; i < domains.length; i++) 
	{
		var domain_row = document.createElement("tr");
		var remove_cell = document.createElement("td");
		var domain_name_cell = document.createElement("td");

		remove = get_remove_cell(i + 1, domains[i]); // row + 1 to account for the header row
		page = document.createTextNode(domains[i]);

		remove_cell.appendChild(remove);
		domain_name_cell.appendChild(page);

		domain_row.appendChild(remove_cell);
		domain_row.appendChild(domain_name_cell);

		domain_body.appendChild(domain_row);
	}

	table.appendChild(domain_body);
}

function remove_table(table)
{
	var body = table.parentNode;
	body.removeChild(table);

	var no_domains = document.createElement("p");
	no_domains.appendChild(document.createTextNode("No added domains."));
	no_domains.style.margin = "20px";

	body.insertBefore(no_domains, body.firstChild);
}

function get_remove_cell(row, web_page)
{
	var glyph_button = document.createElement("button");
	glyph_button.classList.add("btn");
	glyph_button.classList.add("btn-default");
	glyph_button.classList.add("btn-sm");
	glyph_button.style.color = "#FF0000";

	var glyph_span = document.createElement("span");
	glyph_span.classList.add("glyphicon");
	glyph_span.classList.add("glyphicon-trash");

	glyph_button.appendChild(glyph_span);

	glyph_button.onclick = function ()
	{
		remove_page(row, web_page);
	};

	return glyph_button;
}

function remove_page(row, domain)
{
	page_removal_request = 
	{
		menuItemPressed:"removeDomain",
		domainRequested:domain
	}

	browser.runtime.sendMessage(page_removal_request); // received by the background service
	location.reload(); // refresh page
}

document.addEventListener("click", function(e) 
{
	if (e.target.classList.contains("go-back")) 
	{
    	window.location.replace("./popup.html");
	}

});

get_user_pages()
	.then(show_whitelisted_domains)