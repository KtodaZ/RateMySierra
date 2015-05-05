/**
 * Created by Kyle on 5/3/2015.
 * Main work goes in this file
 * We can also call functions from background.js in this file because background.js is loaded before this file
 */

// Gets professor names and returns string array. className is the class name of the class that the names are in
function getProfessorNames(className) {
    var cell      = document.getElementsByClassName(className); // Gives cell[i] an object containing data of className
    var professor = [];

    for(var i =0; i < cell.length; i++) {
        // Splits into separate string arrays seen here: http://imgur.com/fhgmsEm
        var profNameArray = [];
        profNameArray = cell[i].innerText.trim().split(/[ ]+/);

        if (profNameArray.length === 2) { //TODO: Additional exceptions for strings that contain non-name characters
            console.log(profNameArray); // For debugging (use ctrl-shift-J)
            professor[i] = profNameArray[0] + " " + profNameArray[1];
            console.log(professor[i]); // For debugging
            //TODO: Jquery functionality goes here, using cell[i] object type
        }
    }
    return professor;
}
var professors = getProfessorNames('default1');