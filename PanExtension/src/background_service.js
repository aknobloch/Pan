var user_page_key = "userpages";

browser.runtime.onMessage.addListener((sentMessage, sender) =>
{
	if(sentMessage.changeIcon)
	{
		set_icon(sentMessage.changeIcon, sender.tab.id);
	}
	else if(sentMessage.menuItemPressed = "addDomain")
	{
		save_page();
	}
});


function set_icon(color, tab_id)
{
	icon = 
	{
		path : {
			16: "res/pan_logo_" + color + "_16.png",
			32: "res/pan_logo_" + color + "_32.png"
		},
		tabId : tab_id
	}

	browser.browserAction.setIcon(icon);
}

function save_page()
{
	var current_page = browser.tabs.query({currentWindow: true, active: true});
	var current_storage = browser.storage.local.get(user_page_key);

	Promise.all([current_page, current_storage])
		.then(append_and_save_webpage)
		.catch(on_error);
}

function append_and_save_webpage(promise_result_array)
{
	// first get the current_page result, which is an array
	// we are only interested in the top most page, which is the zeroth index
	// then we are interested in the url from that page.
	var current_page_result = promise_result_array[0][0].url;
	var current_page_domain = get_hostname(current_page_result);

	// the current storage will be the next object in the result array
	var current_storage_result = promise_result_array[1].userpages; 

	if(is_contained(current_page_domain, current_storage_result))
	{
		return;
	}

	var new_storage = current_storage_result;

	if(new_storage == null)
	{
		new_storage = [];
	}

	new_storage.push(current_page_domain);

	browser.storage.local.set(
	{
		userpages: new_storage
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

function on_error(err)
{
	console.log(err); // TODO user feedback
}