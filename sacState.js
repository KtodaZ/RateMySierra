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
var schoolName = 'California+State+University%2C+Sacramento';
var schoolNameString = "Sacramento State";
var professorClassName = 'PSLONGEDITBOX';
var iframeObject = $("#ptifrmtgtframe");
var defaultMessage = '<b>Hover</b> over any professor name to view their ratings';
var timers = [];

// Starting point of program
function sacState() {
    $(document).ready(function()
    {
        // Clears all timers so they don't stack
        for (var i = 0; i < timers.length; i++) {
            clearTimeout(timers[i]);
        }
        // Removes ghost qtips from page if any
        $(".qtip").remove();

        htmlChecker();
    });

}

// Checks if iframe is on correct page to inject custom html
function htmlChecker() {
    console.log("Searching for professors");

    var iframeBody = $(iframeObject).contents().find("body");
    var iframeBodyHtml = $(iframeBody).html();

    // Creates temporary html element to experiment with
    var tmp = document.createElement('div');
    tmp.innerHTML = iframeBodyHtml;

    // Detects if page contains names, if it does, returns new HTML
    var newHtml = main(professorClassName, tmp, false);

    if (newHtml) {
        console.log("Professors found, injecting new iframe");

        // Sets new HTML to iframe HTML
        $(iframeObject).contents().find("body").html(newHtml);

        // Timer to check if page is changed
        timers.push(setInterval(function () {

            // Looks for "link" class in html document to see if our html is injected
            if ($(".link",iframeBody).length == 0) {
                console.log("No professors found on current page, restarting search");
                sacState();
            }
        }, 5000));
    } else {

        // Waits x seconds to check page again
        timers.push(setTimeout(function () {
            sacState();
        }, 3000));
    }
}

// Function to parse webpage for teacher names and attach tooltips
function main(className, pageHtml, checkForTeachers) {
    var numberOfProfs = 0;

    // Sorts out element where teacher names are located
    var cellArray     = pageHtml.getElementsByClassName(className);

    for(var i =0; i < cellArray.length; i++) {
        // Gets text from object array and splits into temp strings
        var profName;
        var profTempArray = [];

        // Sorts out potential teacher names by space and puts into array
        profTempArray = $(cellArray[i]).text().trim().split(/[ ]+/);
        //console.log(profTempArray);

        try {
            // To search for specific regex in sac states website
            var regex1 = new RegExp(profTempArray[0]);
            var regex2 = new RegExp(profTempArray[2]);
        } catch(e) { // For Regex errors
        }

        // Sac State specific search function for double line prof names
        if (profTempArray.length == 3
            && regex1.test(profTempArray[1]) && regex2.test(profTempArray[1])
            && /[A-Z]/.test(profTempArray[0]) && /[A-Z]/.test(profTempArray[2])
            && !/\./.test(profTempArray[0]) && !/\./.test(profTempArray[1]) && !/\./.test(profTempArray[2])
            && profTempArray.indexOf("Online") === -1) {

            profName = profTempArray[0] + " " + profTempArray[2];
            mainRunScript();
        }

        // Global search function
        if (profTempArray.length === 2
            && /[A-Z]/.test(profTempArray[0]) && /[A-Z]/.test(profTempArray[1])
            && !/\./.test(profTempArray[0]) && !/\./.test(profTempArray[1])
            && profTempArray.indexOf("Online") === -1) {

            profName = profTempArray[0] + " " + profTempArray[1];
            mainRunScript();
        }

        function mainRunScript() {
            // Returns true if at least 1 teacher is found
            if (checkForTeachers)
                return true;

            // Creates placeholder hyperlinks
            var url = '<a class="link" href="'+ returnNormalSearchUrl(profName) + '" target="_blank" title="RMP Search page">'+ profName + '</a>';
            $(cellArray[i]).text('');
            cellArray[i].innerHTML = url;
            numberOfProfs++;

            // Call for tooltips and dynamic content load
            tooltip(cellArray[i], pageHtml);
            hover(cellArray[i], profName);
        }
    }

    // Returns false if no profs are found
    if (numberOfProfs > 0)
        return pageHtml;
    else
        return false;
}

// Creates tooltip
function tooltip(cell, pageHtml) {

    $(document).ready(function () {
        var DOM = $("#ptifrmtgtframe");
        $(cell).qtip({
            id: 'profTip',
            prerender: true,
            content: {
                text: "<b>Click</b> to view their RateMyProfessor page",
                title: defaultMessage,
                button: 'close'
            },
            position: {
                target: [700, 115],
                viewport: DOM
            },
            style: {
                classes: 'qtip-bootstrap',
                width: 160,
                //heigth: 160,
                tip: {
                    corner: false
                }
            },
            show: {
                solo: true,
                ready: true,
                effect: function(offset) {
                    $(this).slideDown(100);
                }
            },
            hide: {
                event: 'unfocus',
                leave: false,
                fixed: true,
                effect: function(offset) {
                    $(this).slideDown(100);
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
            $(cell).qtip('option', 'content.title', '');
            $(cell).qtip('option', 'content.text', '. . . loading . . .');
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

                // Sets tooltips
                $(cell).qtip('option', 'content.text',
                '<div id=\"contentBox\" style=\"margin:0px auto; width:100%\">' +

                '<div id=\"column1\" style=\"float:left; margin:0; width:80%;\">' +
                "Overall Quality:<br>Average Grade:<br>Helpfulness:<br>Clarity:<br>Easiness:" +
                '</div>' +

                '<div id=\"column2\" style=\"float:left; margin:0;width:20%;\">' +
                 ratingArray[1] + "<br>" + ratingArray[0]+ "<br>" + ratingArray[2] + "<br>" + ratingArray[3] + "<br>" + ratingArray[4] +
                '</div>' +

                '</div>');

                $(cell).qtip('option', 'content.title', "<b>" + profNameWithSpace + "</b>");
            });
        }
        // If no prof is found
        else {
            profURL = returnNormalSearchUrl(profNameWithSpace);
            //$(cell).tooltip("option", "content", "No professors found, click to search all schools.");
            $(cell).qtip('option', 'content.text',"No professors found for" + schoolNameString + ", click to search all schools.");
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

sacState();

