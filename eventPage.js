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

// Displays icon in address bar when script is active
function showPageAction( tabId, changeInfo, tab ) {
    if(tab.url == "https://banprodssb.sierracollege.edu:8810/PROD/pw_sigsched.p_process"){
        chrome.pageAction.show(tabId);
    }
}

chrome.tabs.onUpdated.addListener(showPageAction);

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
/*
// Function to make xmlhttprequests
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
*/

// Function to make xmlhttprequests
chrome.runtime.onMessage.addListener(function(request, sender, callback) {

    var xhr = new XMLHttpRequest();

    xhr.open('GET', request.url, true);

    xhr.onerror = function() {
        callback();
    };

    xhr.onreadystatechange = function() {

        if (/http:..www.ratemyprofessors.com.search.jsp.queryBy=teacherName&schoolName=/g.test(request.url)) {

            if (xhr.readyState == 4) {
                var tmp = document.createElement('div');
                var linkString = xhr.responseText;

                for (var i = 0; i < linkString.length; i++)
                    if (linkString.substring(i, i + 11) === "ShowRatings")
                        var profURL = 'http://www.ratemyprofessors.com/' + linkString.slice(i, i + 25);

                console.log(profURL);

                // If prof found
                if (/http:..www.ratemyprofessors.com.ShowRatings.jsp.tid=\d\d\d\d\d/.test(profURL))
                    callback(profURL);

                // If no prof found or error
                callback();
            }
        }

        else {
            callback();
        }
    };

    xhr.send();

    return true; // prevents the callback from being called too early on return
});


// Logs chrome storage changes
chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        console.log('Storage key "%s" in namespace "%s" changed. ' +
            'Old value was "%s", new value is "%s".',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);
    }
});