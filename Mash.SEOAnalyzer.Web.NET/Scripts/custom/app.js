var baseUrl = '/';
var badWords = [];
var badStr = 'Bad Word Found!';
var oopsStr = 'Oops...';
var emptyStr = 'Domain name field can\'t empty!';

function containsAny(str, substrings) {
    for (var i = 0; i != substrings.length; i++) {
        var substring = substrings[i];
        if (str.indexOf(substring) != - 1) {
            return substring;
        }
    }
    return null;
}

function fixURL() {
    //Check URL
    var myUrl = jQuery.trim($('input[name=url]').val());
    if (myUrl == null || myUrl == "") {
        sweetAlert(oopsStr, emptyStr, "error");
        return false;
    }
    //Fix URL
    if (myUrl.indexOf("http://") == 0) {
        myUrl = myUrl.substring(7);
        document.getElementById("url").value = myUrl;
    }
    if (myUrl.indexOf("https://") == 0) {
        myUrl = myUrl.substring(8);
        document.getElementById("url").value = myUrl;
    }
    if (containsAny(myUrl, badWords) !== null) {
        sweetAlert(oopsStr, badStr, "error");
        return false;
    }
    return true;
}

function getCapKeys(capType) {
    var postName, capCode;
    var bolCheck = false;
    if (capType == 'phpcap') {
        capCode = $('input[name=scode]').val();
        postName = 'scode';
        bolCheck = true;
    } else if (capType == 'recap') {
        capCode = grecaptcha.getResponse();
        postName = 'g-recaptcha-response';
        bolCheck = true;
    }
    return [bolCheck, postName, capCode];
}

function reloadCap() {
    $('input[name="scode"]').val('');
    $('input[name="scode"]').attr("placeholder", "Loading...");
    $('input[name="scode"]').prop('disabled', true);
    $('#capImg').css("opacity", "0.5");
    jQuery.get(baseUrl + 'phpcap/reload', function (data) {
        $('#capImg').attr('src', jQuery.trim(data));
        $('input[name="scode"]').attr("placeholder", "");
        $('input[name="scode"]').prop('disabled', false);
        $('#capImg').css("opacity", "1");
    });
}

if (document.getElementById('headturbo')) {
    document.addEventListener('DOMContentLoaded', function () {
        particleground(document.getElementById('headturbo'), {
            dotColor: 'rgba(255,255,255, 0.1)',
            lineColor: 'rgba(255,255,255, 0.2)'
        });
        var intro = document.getElementById('headturbo-wrap');
        intro.style.marginTop = "-635px";
    }, false);
}

jQuery(document).ready(function () {

});

$(function () {
    var sortMsg = "</br>  <small class='green'>(click <i class='fa fa-hand-pointer-o' aria-hidden='true'></i> to sort)</small>";
    var messages = {
        textAreInput: "Input in Text Area",
        emptyInputs: "No input or the input is not in English. Plese enter text in English or url to Engish page",
        emptyUrlInput: "External source is empty",
        emptyExternalSourceResponse: "External source service has problems ",
        noData: "No data is retrieved",
        serverError: "Oops Something went wrong"
    };

    function intializeSortableTable(containerId, data, numberOfColums, colsTitles) {
        var tableFields = [];
        switch (numberOfColums) {
            case 1:
                tableFields = [{ name: "Key", type: "text", width: "100%", title: colsTitles[0] }];
                break;
            case 2:
                tableFields = [
                    { name: "Key", type: "text", width: "80%", title: colsTitles[0] },
                    { name: "Value", type: "number", width: "20%", title: colsTitles[1] }
                ]
                break;
        }

        $("#" + containerId).jsGrid({
            //height: "100%", //fix for scrollbar issue
            width: "100%",
            sorting: true,
            paging: true,
            data: data,
            fields: tableFields
        });
    }

    function AddBootsrapGridClasses(numberOfTables) {
        var tablesCssClass = "col-sm-6 col-md-6 col-lg-6";
        //var numberOfTables = $('.jsgrid-grid-header').length;
        console.log(numberOfTables);
        switch (numberOfTables) {
            case 1:
                tablesCssClass = "col-sm-12 col-md-12 col-lg-12";
                break;
            //    case 2:
            //        tablesCssClass = "col-sm-6 col-md-6 col-lg-6";
            //        break;
            //    case 3:
            //        tablesCssClass = "col-sm-6 col-md-6 col-lg-6";
            //        break;
        }

        $("#jsGrid-analyzer-results-keywords").parent().removeClass();
        $("#jsGrid-analyzer-results-keywords-meta").parent().removeClass();
        $("#jsGrid-analyzer-results-external-links").parent().removeClass();
        $("#jsGrid-analyzer-results-external-html").parent().removeClass();

        $("#jsGrid-analyzer-results-keywords").parent().addClass(tablesCssClass);
        $("#jsGrid-analyzer-results-keywords-meta").parent().addClass(tablesCssClass);
        $("#jsGrid-analyzer-results-external-links").parent().addClass(tablesCssClass);
        $("#jsGrid-analyzer-results-external-html").parent().addClass(tablesCssClass);
    }

    function addTitle(jsonData) {
        var analisysTitle = $('#analisys-object-title');
        if (jsonData.ExternalSourceUrl) {
            analisysTitle.find('span').html(jsonData.ExternalSourceUrl);
        }
        else if ($('#internal-source').val()) {
            $('#analisys-object-title').find('span').html(messages.textAreInput);
        }
        else {
            $('#analisys-object-title').find('span').html(messages.emptyInputs);
        }

        $('#analisys-object-title').removeClass('hidden');
    }

    function addEmptyResultErrorMsg(jsonData) {
        console.log(jsonData);
        if (jsonData.ExternalSourceUrl && jsonData.ResponseStatus == "Success") {
            $('#error-msg').html("External source is empty");
        }
        else if (jsonData.ExternalSourceUrl && jsonData.ResponseStatus == "Failed") {
            $('#error-msg').html(messages.emptyExternalSourceResponse + jsonData.ResponseStatusMsg);
        }
        else if (jsonData.ExternalSourceUrl && jsonData.ResponseStatus == "NotResolved") {
            $('#error-msg').html(messages.emptyExternalSourceResponse + jsonData.ResponseStatusMsg);
        }
        else {
            $('#error-msg').html(messages.emptyInputs);
        }

        $('#error-msg').removeClass('hidden');
    }

    function clearResult() {
        $('.table-results-container').empty();
        $('#error-msg').empty().addClass('hidden');
        $('#external-source').val('');
        $('#analisys-object-title').addClass('hidden');
    }

    $('#button-text-analyzer').click(function (ev) {
        ev.preventDefault();
        clearResult();
        $('#analyze-else').addClass('hidden');
        $("#submit-button1").removeClass('hidden');
        $("#submit-button2").addClass('hidden');
        $("#text-box-input-container").removeClass('hidden');
        $("#url-input-container").addClass('hidden');
        $('#analyzer-filter-form').trigger("reset");
        $('html, body').animate({
            scrollTop: $("#text-box-input-container").offset().top
        }, 2000);

        return false;
    });

    $('#button-url-analyzer').click(function (ev) {
        ev.preventDefault();
        clearResult();
        $('#analyze-else').addClass('hidden');
        $("#submit-button2").removeClass('hidden');
        $("#submit-button1").addClass('hidden');
        $("#url-input-container").removeClass('hidden');
        $("#text-box-input-container").addClass('hidden');
        $('#analyzer-filter-form').trigger("reset");
        $('html, body').animate({
            scrollTop: $("#url-input-container").offset().top
        }, 2000);
        return false;
    });

    $('#analyze-else').click(function (ev) {
        clearResult();
        $('#analyzer-filter-form').trigger("reset");
        $("html, body").animate({ scrollTop: 0 }, "slow");
        $('#analyze-else').addClass('hidden');
        return false;
    });

    $("#analyzer-filter-form1").on("submit", function (event) {
        event.preventDefault();
        var form = $(this);
        var collection = form.serialize();
        var url = form.attr("action");
        $.ajax({
            url: url,
            data: collection,
            type: 'POST',
            xhr: function () { // progressbar
                var xhr = $.ajaxSettings.xhr();
                if (xhr.upload) {
                    xhr.upload.addEventListener('progress', function () {
                        $('#analyze-else').addClass('hidden');
                        $('#preloader').removeClass("hidden");
                        clearResult();
                    }, false);
                }
                return xhr;
            },
            success: function (data) {
                $('#preloader').addClass("hidden");
                $('html, body').animate({
                    scrollTop: $("#analisys-results-container").offset().top
                }, 2000);
                if (data) {
                    var jsonData = JSON.parse(data);
                    int
                    var noOfTables = 0;

                    addTitle(jsonData);
                    if (jsonData.WordOccurrenceCounts && Object.keys(jsonData.WordOccurrenceCounts).length > 0) {
                        var dicts = [];
                        var titles = ["Keyword" + sortMsg, "Frequency" + sortMsg];
                        for (const [k, v] of Object.entries(jsonData.WordOccurrenceCounts)) {
                            dicts.push({ Key: k, Value: v })
                        }
                        noOfTables++;
                        intializeSortableTable("jsGrid-analyzer-results-keywords", dicts, 2, titles);
                    }
                    else {
                        addEmptyResultErrorMsg(jsonData);
                    }

                    //if (jsonData.MetaKeyWordOccurrencesInTextCounts && Object.keys(jsonData.MetaKeyWordOccurrencesInTextCounts).length > 0) {
                    //    var dicts = [];
                    //    var titles = ["Keyword in Meta" + sortMsg, "Frequency" + sortMsg];
                    //    for (const [k, v] of Object.entries(jsonData.MetaKeyWordOccurrencesInTextCounts)) {
                    //        dicts.push({ Key: k, Value: v })
                    //    }
                    //    intializeSortableTable("jsGrid-analyzer-results-keywords-meta", dicts, 2, titles);
                    //}

                    if (jsonData.ExternalLinksFoundInTextCount && Object.keys(jsonData.ExternalLinksFoundInTextCount).length > 0) {
                        var dicts = [];
                        var titles = ["External Links" + sortMsg];
                        for (const [k, v] of Object.entries(jsonData.ExternalLinksFoundInTextCount)) {
                            dicts.push({ Key: k, Value: v })
                        }
                        noOfTables++;
                        intializeSortableTable("jsGrid-analyzer-results-external-links", dicts, 2, titles);
                    }
                    //if (jsonData.ExternalLinksFoundInHtmlCount && Object.keys(jsonData.ExternalLinksFoundInHtmlCount).length > 0) {
                    //    var dicts = [];
                    //    var titles = ["External Links" + sortMsg];
                    //    for (const [k, v] of Object.entries(jsonData.ExternalLinksFoundInHtmlCount)) {
                    //        dicts.push({ Key: k, Value: v })
                    //    }
                    //    intializeSortableTable("jsGrid-analyzer-results-external-html", dicts, 2, titles);
                    //}

                    AddBootsrapGridClasses(noOfTables);
                    $('#analyze-else').removeClass('hidden');
                }
                else {
                    $('#error-msg').html(messages.noData);
                    $('#error-msg').removeClass('hidden');
                    $('#analyze-else').removeClass('hidden');
                }
            },
            error: function (err) {
                $('#preloader').addClass("hidden");
                $('#error-msg').html(messages.serverError);
                $('#error-msg').removeClass('hidden');
                $('#analyze-else').removeClass('hidden');
            }
        });

        return false;
    });
    $("#analyzer-filter-form2").on("submit", function (event) {
        event.preventDefault();
        var form = $(this);
        var collection = form.serialize();
        var url = form.attr("action");
        $.ajax({
            url: url,
            data: collection,
            type: 'POST',
            xhr: function () { // progressbar
                var xhr = $.ajaxSettings.xhr();
                if (xhr.upload) {
                    xhr.upload.addEventListener('progress', function () {
                        $('#analyze-else').addClass('hidden');
                        $('#preloader').removeClass("hidden");
                        clearResult();
                    }, false);
                }
                return xhr;
            },
            success: function (data) {
                $('#preloader').addClass("hidden");
                $('html, body').animate({
                    scrollTop: $("#analisys-results-container").offset().top
                }, 2000);
                if (data) {
                    var jsonData = JSON.parse(data);
                    var noOfTables = 0;
                    addTitle(jsonData);
                    if (jsonData.WordOccurrenceCounts && Object.keys(jsonData.WordOccurrenceCounts).length > 0) {
                        var dicts = [];
                        var titles = ["Keyword" + sortMsg, "Frequency" + sortMsg];
                        for (const [k, v] of Object.entries(jsonData.WordOccurrenceCounts)) {
                            dicts.push({ Key: k, Value: v })
                        }
                        noOfTables += 1;
                        intializeSortableTable("jsGrid-analyzer-results-keywords", dicts, 2, titles);
                    }
                    else {
                        addEmptyResultErrorMsg(jsonData);
                    }

                    if (jsonData.MetaKeyWordOccurrencesInTextCounts && Object.keys(jsonData.MetaKeyWordOccurrencesInTextCounts).length > 0) {
                        var dicts = [];
                        var titles = ["Keyword in Meta" + sortMsg, "Frequency" + sortMsg];
                        for (const [k, v] of Object.entries(jsonData.MetaKeyWordOccurrencesInTextCounts)) {
                            dicts.push({ Key: k, Value: v })
                        }
                        noOfTables += 1;
                        intializeSortableTable("jsGrid-analyzer-results-keywords-meta", dicts, 2, titles);
                    }

                    if (jsonData.ExternalLinksFoundInTextCount && Object.keys(jsonData.ExternalLinksFoundInTextCount).length > 0) {
                        var dicts = [];
                        var titles = ["External Links in Text" + sortMsg];
                        for (const [k, v] of Object.entries(jsonData.ExternalLinksFoundInTextCount)) {
                            dicts.push({ Key: k, Value: v })
                        }
                        noOfTables += 1;
                        intializeSortableTable("jsGrid-analyzer-results-external-links", dicts, 2, titles);
                    }
                    if (jsonData.ExternalLinksFoundInHtmlCount && Object.keys(jsonData.ExternalLinksFoundInHtmlCount).length > 0) {
                        var dicts = [];
                        var titles = ["External Links in Html" + sortMsg];
                        for (const [k, v] of Object.entries(jsonData.ExternalLinksFoundInHtmlCount)) {
                            dicts.push({ Key: k, Value: v })
                        }
                        noOfTables += 1;
                        intializeSortableTable("jsGrid-analyzer-results-external-html", dicts, 2, titles);
                    }

                    AddBootsrapGridClasses();
                    $('#analyze-else').removeClass('hidden');
                }
                else {
                    $('#error-msg').html(messages.noData);
                    $('#error-msg').removeClass('hidden');
                    $('#analyze-else').removeClass('hidden');
                }
            },
            error: function (err) {
                $('#preloader').addClass("hidden");
                $('#error-msg').html(messages.serverError);
                $('#error-msg').removeClass('hidden');
                $('#analyze-else').removeClass('hidden');
            }
        });

        return false;
    });
});