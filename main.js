
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
/*
// Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-40544502-2']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
*/
// Gets professor names and returns string array. className is the class name of the class that the names are in
function getProfessorNames(className) {
    var cellArray     = document.getElementsByClassName(className);

    for(var i =0; i < cellArray.length; i++) {
        // Gets text from object array and splits into temp strings
        var profTempArray = [];
        profTempArray = $(cellArray[i]).text().trim().split(/[ ]+/);

        /*  Sorts out teachers names from other information.
         *  First checks if the name consists of two words,
         *  then checks if the first letter of the first and
         *  last name are capitalized using regex
         */
        if (profTempArray.length === 2 && /[A-Z]/.test(profTempArray[0]) && /[A-Z]/.test(profTempArray[1])) {
            var profName = profTempArray[0] + " " + profTempArray[1];

            // Creates placeholder hyperlink for if user clicks before returnProfUrl finishes running
            var url = '<a href="'+ returnNormalSearchUrl(profName) + '" target="_blank" title="RMP Search page">'+ profName + '</a>';
            $(cellArray[i]).text('');
            cellArray[i].innerHTML = url;

            // Uses hover function to dynamically load direct prof page
            tooltip(cellArray[i]);
            hover(cellArray[i], profName);
        }
    }
}

// Creates tooltip
function tooltip(cell) {
    $(document).ready(function () {
        $(cell).tooltip({
            content:". . . loading . . .",
            hide: { effect: "fade", duration: 200 }
        })
    });
}

// Dynamically calls returnProfUrl on mouse over
function hover(cell, profNameWithSpace) {
    var haveProfUrl = false;

    $(cell).mouseenter(function() {
        // For removing tooltips that remain on the page(necessary)
        $('.ui-tooltip.ui-widget.ui-corner-all.ui-widget-content').remove();

        // Checks hyperlink so returnProfUrl only loads once
        if (!haveProfUrl) {
            returnProfUrl(cell, profNameWithSpace);
            haveProfUrl = true;
        }
    });
}

// Finds actual teacher URL. Returns search page for no professors
function returnProfUrl(cell, profNameWithSpace) {
    var searchURL = returnSchoolSearchUrl(profNameWithSpace);

    // Uses XMLHttpRequest in eventPage.js to load content from RMP
    // TODO: Find way to do this so that page is still secure
    chrome.runtime.sendMessage({
        url: searchURL
    }, function (responseText) {
        // Sets searchURL html to tmp element
        var tmp        = document.createElement('div');
        tmp.innerHTML  = responseText;

        // Finds location of url on page
        // TODO: Find more permanent way to do this, incase RMP changes their page
        var link     = tmp.getElementsByTagName("a");
        var profURL = 'http://www.ratemyprofessors.com/' + link[52].toString().slice(42);

        // If prof is found, get html from teacher page and apply to tooltip
        if (profURL != 'http://www.ratemyprofessors.com/About.jsp') {
            // Set tooltip
            $(cell).tooltip("option", "content", "Professor Found!");
            /*
            THERE BE DRAGONS
            THIS NO WORK
            LOOKING AT THIS http://qtip2.com/guides
            TRYING TO FIGURE OUT IF I NEED TO USE THE XMLHTTPREQUEST BELOW OR IF I CAN USE AJAX I THINK IT'S THE FORMER
            */
            console.log('href=\'' + profURL + '\'');

            // xmlHttpRequest for professor page
            chrome.runtime.sendMessage({
                url: this.profURL
            }, function (responseText) {
                // Same thing as before, Sets profURL html to tmp element
                var tmp = document.createElement('div');
                tmp.innerHTML = responseText;

                // Finds html we want to display
                var profGraphic = tmp.getElementsByClassName("ui-slider-range");
                console.log(profGraphic);

                var iframeWidth = '600';
                var iframeHeight = '500';

                $(cell).qtip({
                    content: {
                        text: '<iframe src="' + $(cell).attr('href=\'' + profURL + '\'') + '"' + 'width=' + iframeWidth + '"' + 'height=' + '"' + iframeHeight + '" scrolling="no" frameborder="0"><p>Your browser does not support iframes.</p> </iframe>',
                        title: {
                            text: 'Preview'
                        }
                    }
                });

            });
        } else { // If no prof is found
            profURL = returnNormalSearchUrl(profNameWithSpace);
            $(cell).tooltip("option", "content", "No professors found, click to search all schools.");
        }

        // Applies new hyperlink to page
        cell.innerHTML = '<a href="'+ profURL + '" target="_blank" title="RMP Professor page">'+ profNameWithSpace + '</a>';
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