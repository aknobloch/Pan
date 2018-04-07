document.addEventListener("click", function(e) 
{
  if (e.target.classList.contains("go-back")) 
  {
      window.location.replace("./popup.html");
  }
  else if(e.target.classList.contains("accordion"))
  {
     // Temporarily hide scroll bar while we resize.
    show_scroll_bar(false);

    var accordion = e.target || e.srcElement;
    
    accordion.classList.toggle("active");
    var panel = accordion.nextElementSibling;

    if (panel.style.maxHeight) 
    {
        panel.style.maxHeight = null;
    } 
    else 
    {
        panel.style.maxHeight = panel.scrollHeight + "px";
    }

    collapse_other_sections(accordion);
    show_scroll_bar(true);
  }

});

function show_scroll_bar(should_show)
{
  var state = "hidden";

  if(should_show == true)
  {
    state = "visible";
  }

  document.body.style.overflow = state;
}

function collapse_other_sections(current_accordion)
{
  var accordions = document.getElementsByClassName("accordion");

  for(var i = 0; i < accordions.length; i++)
  {
    var accordion = accordions[i];

    if(accordion === current_accordion)
    {
      continue;
    }

    accordion.classList.remove("active");
    var accordion_panel = accordion.nextElementSibling;
    accordion_panel.style.maxHeight = null;
  }
}