/**
 * Created by William on 5/15/2015.
 */
//give access to background page
var bkg = chrome.extension.getBackgroundPage();
// Saves options to chrome.storage.sync.
function save_options() {
    //declare and set schoolName
    var schoolName = document.getElementById('schoolName').value;
    chrome.storage.sync.set({'schoolName': schoolName},
        function() {
            // Update status to let user know options were saved.
            var status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(function() {
                status.textContent = '';
            }, 750);
        });
    bkg.console.log(chrome.storage.sync.get("schoolName", callback))
}

function get_options(callback) { bkg.console.log(chrome.storage.sync.get("schoolName", callback)); }

document.getElementById('save').addEventListener('click',
    save_options);

document.getElementById('get').addEventListener('click',
    get_options);