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
var schoolName = 'Sierra+College';
var defaultMessage = 'Hover over any teacher name to view their ratings';

function sierraCollege() {
    main('.default1');
    main('.default2');
    console.log("Script done");
}

function main(className) {
    console.log("script initialized");

    var cellArray     = $(className);

    for(var i =0; i < cellArray.length; i++) {
        // Gets text from object array and splits into temp strings
        var profTempArray = [];
        profTempArray = $(cellArray[i]).text().trim().split(/[ ]+/);

        // Sorts out teacher names
        if (profTempArray.length === 2 && /[A-Z]/.test(profTempArray[0]) && /[A-Z]/.test(profTempArray[1])) {
            var profName = profTempArray[0] + " " + profTempArray[1];

            // Creates placeholder hyperlinks
            var url = '<a class="link" href="'+ returnNormalSearchUrl(profName) + '" target="_blank" title="">'+ profName + '</a>';
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

        $(cell).qtip({
            id: 'myTooltip',
            content: {
                text: '. . . loading . . .'
            },
            style: {
                classes: 'qtip-bootstrap',
                width: 180,
                position: {
                    at: 'mouse'
                }
            },
            show: {
                solo: true,
                ready: true,
                effect: function(offset) {
                    $(this).slideDown(100); // "this" refers to the tooltip
                }
            },
            hide: {
                effect: function(offset) {
                    $(this).slideDown(100); // "this" refers to the tooltip
                }
            }
        });
    });
}

// Dynamically calls setProfessorURL on mouse over
function hover(cell, profNameWithSpace) {

    var haveProfUrl = false;

    $(cell).mouseenter(function() {
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

    // Uses XMLHttpRequest in eventPage.js to load ProfURL
    chrome.runtime.sendMessage({
        url: searchURL
    }, function (response) {

        var profURL = response;
        console.log(profURL);

        // If a professor is found
        if (profURL != null) {

            // xmlHttpRequest for professor page
            chrome.runtime.sendMessage({
                url: profURL
            }, function (response) {
                var ratingArray = response;
                //console.log(ratingArray);

                $(cell).qtip('option', 'content.text',
                    '<div id=\"contentBox\" style=\"margin:0px auto; width:100%\">' +

                    '<div id=\"column1\" style=\"float:left; margin:0; width:80%;\">' +
                    "Overall Quality:<br>Average Grade:<br>Helpfulness:<br>Clarity:<br>Easiness:" +
                    '</div>' +

                    '<div id=\"column2\" style=\"float:left; margin:0;width:20%;\">' +
                    ratingArray[1] + "<br>" + ratingArray[0]+ "<br>" + ratingArray[2] + "<br>" + ratingArray[3] + "<br>" + ratingArray[4] +
                    '</div>' +

                    '</div>');
                $(cell).qtip('option', 'content.title', profNameWithSpace);
            });
        }
        // If no prof is found
        else {
            profURL = returnNormalSearchUrl(profNameWithSpace);
            //$(cell).tooltip("option", "content", "No professors found, click to search all schools.");
            $(cell).qtip('option', 'content.text',"No professors found, click to search all schools.");
        }

        // Applies new hyperlink to page
        cell.innerHTML = '<a class="link" href="'+ profURL + '" target="_blank" title="">'+ profNameWithSpace + '</a>';

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

sierraCollege();

