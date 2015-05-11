/*<Content Script for main processes of extension>
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

// Gets professor names and returns string array. className is the class name of the class that the names are in
function getProfessorNames(className) {
    var cellArray     = document.getElementsByClassName(className);
    var profTempArray = [];

    for(var i =0; i < cellArray.length; i++) {
        // Gets text from object array and splits into temp strings
        profTempArray = $(cellArray[i]).text().trim().split(/[ ]+/);

        /*  Sorts out teachers names from other information.
         *  First checks if the name consists of two words,
         *  then checks if the first letter of the first and
         *  last name are capitalized using regex
         */
        if (profTempArray.length === 2 && /[A-Z]/.test(profTempArray[0]) && /[A-Z]/.test(profTempArray[1])) {
            var profName = profTempArray[0] + " " + profTempArray[1];

            // Creates placeholder hyperlink for if user clicks before returnProfUrl finishes running
            var url= '<a href="'+ returnNormalSearchUrl(profName) + '" target="_blank">'+ profName + '</a>';
            $(cellArray[i]).text('');
            cellArray[i].innerHTML = url;

            // Uses hover function to dynamically load direct prof page
            hover(cellArray[i], profName, url);
        }
    }
}

// Dynamically calls returnProfUrl on mouse over
function hover(cell, profNameWithSpace, url) {
    $(cell).mouseenter(function() {
        // Checks hyperlink so returnProfUrl only loads once
        if (cell.innerHTML.indexOf('<a href="http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&amp;schoolName=') === 0) {
            returnProfUrl(cell, profNameWithSpace);
        }
    });
}

// Finds actual teacher URL. Returns search page for no professors
function returnProfUrl(cell, profNameWithSpace) {
    var searchURL = returnSchoolSearchUrl(profNameWithSpace);

    // Uses XMLHttpRequest in eventPage.js to load content from RMP
    // Note that I have no idea how this works... :)
    chrome.runtime.sendMessage({
        url: searchURL
    }, function (responseText) {
        // Creates temp element to make changes to
        var tmp        = document.createElement('div');
        tmp.innerHTML  = responseText;

        // Finds location of url on page
        var link     = tmp.getElementsByTagName("a");
        var profURL = 'http://www.ratemyprofessors.com/' + link[52].toString().slice(42);
        console.log("profURL: " + profURL);

        // Searches all schools if no prof found
        if (profURL == 'http://www.ratemyprofessors.com/About.jsp') {
            profURL = returnNormalSearchUrl(profNameWithSpace);
        }

        // Applies new hyperlink to page
        cell.innerHTML = '<a href="'+ profURL + '" target="_blank">'+ profNameWithSpace + '</a>';
    });
}

// Returns search url for specific school
function returnSchoolSearchUrl(profNameWithSpace) {
    return "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=" + schoolName +
        "&queryoption=HEADER&query=" + encodeURI(profNameWithSpace) + "&facetSearch=true";
}

// Returns search url for all schools
function returnNormalSearchUrl(profNameWithSpace) {
    return "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&query=" + encodeURI(profNameWithSpace);
}

getProfessorNames('default1');
getProfessorNames('default2');
console.log("Script done");