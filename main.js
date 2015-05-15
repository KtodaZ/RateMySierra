
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


var schoolName = "sierra + college";

function main(className) {
    var cellArray     = document.getElementsByClassName(className);

    for(var i =0; i < cellArray.length; i++) {
        // Gets text from object array and splits into temp strings
        var profTempArray = [];
        profTempArray = $(cellArray[i]).text().trim().split(/[ ]+/);
        
         // Sorts out teacher names
        if (profTempArray.length === 2 && /[A-Z]/.test(profTempArray[0]) && /[A-Z]/.test(profTempArray[1])) {
            var profName = profTempArray[0] + " " + profTempArray[1];

            // Creates placeholder hyperlinks
            var url = '<a href="'+ returnNormalSearchUrl(profName) + '" target="_blank" title="RMP Search page">'+ profName + '</a>';
            $(cellArray[i]).text('');
            cellArray[i].innerHTML = url;

            // Call for tooltips and dynamic content load
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

// Dynamically calls setProfessorURL on mouse over
function hover(cell, profNameWithSpace) {
    var haveProfUrl = false;

    $(cell).mouseenter(function() {
        // For removing tooltips that remain on the page(necessary)
        $('.ui-tooltip.ui-widget.ui-corner-all.ui-widget-content').remove();

        // Checks hyperlink so setProfessorURL only loads once
        if (!haveProfUrl) {
            setProfessorURL(cell, profNameWithSpace);
            haveProfUrl = true;
        }
    });
}

// Finds actual teacher URL. Returns search page for no professors
function setProfessorURL(cell, profNameWithSpace) {
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
        var link       = tmp.getElementsByTagName("a");
        var linkString = link[52].toString();

		for(var i = 0; i < linkString.length; i++)
		    if(linkString.substring(i, i+11) === "ShowRatings")
		        var profURL = 'http://www.ratemyprofessors.com/' + linkString.slice(i);


        // If a professor is found
        if (profURL != 'http://www.ratemyprofessors.com/About.jsp') {
            // Set tooltip
            $(cell).tooltip("option", "content", "Professor Found!");

            // xmlHttpRequest for professor page
            chrome.runtime.sendMessage({
                url: this.profURL
            }, function (responseText) {
                // Same thing as before, Sets profURL html to tmp element
                var tmp = document.createElement('div');
                tmp.innerHTML = responseText;

                // Finds html we want to display
                var profGraphic = tmp.getElementsByClassName("ui-slider-range");

                var iframeWidth = '600';
                var iframeHeight = '500';

                var iframe = $('<iframe />').attr({
                	src: profURL,
                	alt: "Cannot Load",
                	height: iframeHeight,
                	width: iframeWidth
                });
                $(cell).qtip({
		            content: iframe,
		            position: {
				    	viewport: $(window)
				    }
		        });
            });
        }
        // If no prof is found
        else {
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


// ENTRY POINT
main('default1');
main('default2');
console.log("Script done");