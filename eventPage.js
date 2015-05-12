/*<Event Page to direct events called from content scripts>
 Copyright (C) <2015>  <Kyle Szombathy, William Hexberg>

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var schoolName = "sierra + college";

//displays icon in address bar when script is active
function showPageAction( tabId, changeInfo, tab ) {
    if(tab.url == "https://banprodssb.sierracollege.edu:8810/PROD/pw_sigsched.p_process"){
        chrome.pageAction.show(tabId);
    }
}

/*
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
        var profNameWithSpace = e.selectionText;
        searchNewTab(profNameWithSpace);
    }
});

function searchNewTab(profNameWithSpace) {
    var url = returnUrl(profNameWithSpace); // creates url for RMP with selected text
    chrome.tabs.create(
        {"url": url});
}

// Misc functions
function returnUrl(profNameWithSpace) {
    return "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=" + schoolName +
           "&queryoption=HEADER&query=" + encodeURI(profNameWithSpace) + "&facetSearch=true";
}
*/

//function to make xmlhttprequests
chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function() {
        callback(xhr.responseText);
    };
    xhr.onerror = function() {
        callback();
    };

    xhr.open('GET', request.url, true);
    xhr.send();
    return true; // prevents the callback from being called too early on return
});