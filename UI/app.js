Dropzone.autoDiscover = false;

function init() {
    let dz = new Dropzone("#dropzone", {
        url: "/",
        maxFiles: 1,
        addRemoveLinks: true,
        dictDefaultMessage: "Some Message",
        autoProcessQueue: false
    });

    dz.on("complete", function (file) {
        let imageData = file.dataURL;

        var url = "http://127.0.0.1:5000/classify_image"; // Make sure this is the correct endpoint

        // Send a POST request with image data to the server
        $.post(url, {
            image_data: imageData
        })
        .done(function(data) {
            console.log(data);
            if (!data || data.length === 0) {
                // If no data received from the server, show an error message
                $("#resultHolder").hide();
                $("#divClassTable").hide();
                $("#error").show().text("No data received from the server.");
                return;
            }
            // Process the data received from the server and update the UI
            displayResult(data);
        })
        .fail(function(xhr, status, error) {
            // If the request fails, show an error message
            $("#resultHolder").hide();
            $("#divClassTable").hide();
            $("#error").show().text("Error occurred: ");
        });
    });

    $("#submitBtn").on('click', function (e) {
        // Process the file queue when the submit button is clicked
        dz.processQueue();
    });
}

function displayResult(data) {
    let match = null;
    let bestScore = -1;

    // Find the best match based on class probability
    for (let i = 0; i < data.length; ++i) {
        let maxScoreForThisClass = Math.max(...data[i].class_probability);
        if (maxScoreForThisClass > bestScore) {
            match = data[i];
            bestScore = maxScoreForThisClass;
        }
    }

    if (match) {
        // If a match is found, update the UI with the result
        $("#error").hide();
        $("#resultHolder").show();
        $("#divClassTable").show();
        $("#resultHolder").html($(`[data-player="${match.class}"]`).html());

        // Update the class probability scores in the UI
        let classDictionary = match.class_dictionary;
        for (let personName in classDictionary) {
            let index = classDictionary[personName];
            let probabilityScore = match.class_probability[index];
            let elementName = "#score_" + personName;
            $(elementName).html(probabilityScore);
        }
    } else {
        // If no match found, show an error message
        $("#resultHolder").hide();
        $("#divClassTable").hide();
        $("#error").show().text("No match found.");
    }
}

$(document).ready(function() {
    console.log("ready!");
    $("#error").hide();
    $("#resultHolder").hide();
    $("#divClassTable").hide();

    init(); // Initialize the application
});
