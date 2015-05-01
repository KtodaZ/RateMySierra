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
  navigate('http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=sierra+college&queryoption=HEADER&query='
  + searchName + '&facetSearch=true');
});


// Context menu implementation
chrome.contextMenus.create({
    "title": "Search for Professor Ratings",
    "contexts": ["selection"],
    "onclick": function(e) {
        var url = "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=sierra+college&queryoption=HEADER&query="
            + encodeURI(e.selectionText) + "&facetSearch=true";
        chrome.tabs.create(
            {"url" : url });
    }
});