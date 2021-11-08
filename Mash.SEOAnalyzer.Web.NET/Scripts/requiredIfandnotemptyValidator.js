$.validator.unobtrusive.adapters.add('requiredifandnotempty', ['dependentproperty', 'desiredvalue'], function (options) {
    options.rules['requiredifandnotempty'] = options.params;
    options.messages['requiredifandnotempty'] = options.message;
});



$(document).ready(function () {

    $.validator.addMethod('requiredifandnotempty', function (value, element, parameters) {
        var desiredvalue = parameters.desiredvalue;
        desiredvalue = (desiredvalue == null ? '' : desiredvalue).toString();
        var controlType = $("input[id$='" + parameters.dependentproperty + "']").attr("type");
        var actualvalue = {}
        if (controlType == "checkbox" || controlType == "radio") {
            var control = $("input[id$='" + parameters.dependentproperty + "']:checked");
            actualvalue = control.val();
        } else {
            actualvalue = $("#" + parameters.dependentproperty).val();
        }
        if ($.trim(desiredvalue).toLowerCase() === $.trim(actualvalue).toLocaleLowerCase()) {
            var isValid = $.validator.methods.required.call(this, value, element, parameters);
            return isValid;
        }
        return true;
    });
});