// OmniBox search implementation
function resetDefaultSuggestion() {
  chrome.omnibox.setDefaultSuggestion({
  description: 'Search RateMyProfessor for %s'
  });
}
resetDefaultSuggestion();

function navigate(url) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.update(tabs[0].id, {url: url});
  });
}

chrome.omnibox.onInputEntered.addListener(function(searchName) {
  navigate(returnUrl(searchName));
});

// Context menu implementation
chrome.contextMenus.create({
    "title": "Search RateMyProfessor for %s",
    "contexts": ["selection"],
    "onclick": function(e) {
        var url = returnUrl(e.selectionText);
        chrome.tabs.create(
            {"url" : url });
    }
});

// Misc functions
function returnUrl(nameString) {
    return "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=sierra+college&queryoption=HEADER&query="
        + encodeURI(nameString) + "&facetSearch=true";
}
