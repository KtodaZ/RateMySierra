var schoolName = "sierra + college";

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
        var url = returnUrl(e.selectionText); // creates url for RMP with selected text
        chrome.tabs.create(
            {"url" : url });
    }
});

// Misc functions
function returnUrl(profNameWithSpace) {
    return "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=" + schoolName +
           "&queryoption=HEADER&query=" + encodeURI(profNameWithSpace) + "&facetSearch=true";
}