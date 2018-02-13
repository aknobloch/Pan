console.log("Hello, Pan!")
var html = document.documentElement.innerHTML;
console.log("got html: " + html.substring(0, 100))
var doc = new DOMParser().parseFromString(html, 'text/html')
console.log("parsed")
console.log(doc.body.textContent || "")