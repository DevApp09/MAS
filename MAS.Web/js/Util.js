var QUESTIONTYPES = {
    NUMBER: 1,
    DROPDOWN: 2,
    RADIO_BUTTON: 3,
    CHECKBOX: 4,
    MULTI_CHECKBOX: 5,
    DATE: 6,
    TEXTBOX: 7,
    MULTI_TEXTBOX: 8,
    IMAGE: 9,
    IMAGES: 10,
    LOCATION: 11,
    MATRIX: 12,
};

function select2ValidationMsg() {
    if ($(this).val() != "-1") {
        if ($(this).hasClass("svalidate")) {
            $(this).validationEngine('hide');
        } else if ($(this).hasClass("s2validate")) {
            $("#s2id_" + $(this).attr("id")).validationEngine('hide');
        }
    }
}

function attachSelect2Validation(obj) {
    if (obj != "" && obj != undefined && obj != null) {
        if ($.isArray(obj)) {
            obj.each(function (a, b) {
                var ele = $(b);
                if (ele.is("select")) {
                    var s2Id = "s2id_" + ele.attr("id");
                    if ($(s2Id).length == 0) {
                        ele.addClass('svalidate');
                    } else {
                        ele.addClass('s2validate');
                    }
                    ele.on('change', select2ValidationMsg);
                }
            });
        } else {
            var ele = $(obj);
            if (ele.is("select")) {
                var s2Id = "s2id_" + ele.attr("id");
                if ($(s2Id).length == 0) {
                    ele.addClass('svalidate');
                } else {
                    ele.addClass('s2validate');
                }
                ele.on('change', select2ValidationMsg);
            }
        }
    } else {
        $(".s2validate, .svalidate").each(function (a, b) {
            if ($(b).is("select")) {
                $(b).on('change', select2ValidationMsg);
            }
        });
    }
}

function detachSelect2Validation(obj) {
    if (obj != "" && obj != undefined && obj != null) {
        if ($.isArray(obj)) {
            obj.each(function (a, b) {
                var ele = $(b);
                if (ele.is("select")) {
                    var s2Id = "s2id_" + ele.attr("id");
                    if ($(s2Id).length == 0) {
                        ele.removeClass('svalidate');
                    } else {
                        ele.removeClass('s2validate');
                    }
                    ele.off('change', select2ValidationMsg);
                }
            });
        } else {
            var ele = $(obj);
            if (ele.is("select")) {
                var s2Id = "s2id_" + ele.attr("id");
                if ($(s2Id).length == 0) {
                    ele.removeClass('svalidate');
                } else {
                    ele.removeClass('s2validate');
                }
                ele.off('change', select2ValidationMsg);
            }
        }
    } else {
        $(".s2validate, .svalidate").each(function (a, b) {
            if ($(b).is("select")) {
                $(b).off('change', select2ValidationMsg);
            }
        });
    }
}

function validateS2() {
    var isValid = true;
    $(".s2validate, .svalidate").each(function (a, b) {
        if ($(b).is("select") && $(b).is(":visible")) {
            if ($(b).val() == "-1") {
                var pos = $(this).data("promptPosition") == undefined ? 'topRight' : 'bottomLeft';
                if ($(b).hasClass("svalidate")) {
                    $(b).validationEngine('showPrompt', 'This is a required field', 'red', pos, true);
                } else if ($(b).hasClass("s2validate")) {
                    $("#s2id_" + $(b).attr("id")).validationEngine('showPrompt', 'This is a required field', 'red', pos, true);
                }
                isValid = false;
            }
        }
    });
    return isValid;
}

function showLoadingPopup() {
    $(".app-modal").show();
}

function closeLoadingPopup() {
    $(".app-modal").hide();
}

function messageBox(type, title, msg, onCancel, onAccept) {
	$("#popupCnclBtn").hide().unbind();
	$("#popupAcptBtn").unbind();
	$("#titleSpan").html(title);
    $("#msgSpan").html(msg);
    $("#msgBoxImg").removeAttr('class');
    if (type == 0) {
        $("#msgBoxImg").addClass('fa fa-times-circle fa-2x');
    } else if (type == 1) {
        $("#popupCnclBtn").show();
        $("#msgBoxImg").addClass('fa fa-exclamation-circle fa-2x');
        if (onAccept != undefined) {
        	$("#popupAcptBtn").click(function () { onAccept(); });
        }
        if (onCancel != undefined) {
        	$("#popupCnclBtn").click(function () { onCancel(); });
        }
    } else if (type == 2) {
        $("#msgBoxImg").addClass('fa fa-info-circle fa-2x');
    }
    $("#msgDivBtn").trigger('click');
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function deepCompare(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) {
        return false;
    }
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    return true;
}

function isInArray(ele, arr) {
    for (i = 0; i < arr.length; i++) {
        if (deepCompare(arr[i], ele)) {
            return true;
        }
    }
    return false;
}

function validateDecimal(id) {
    document.getElementById(id).addEventListener("keydown", function (e) {
        // prevent: "e", "=", ",", "-", "+"
        if ([69, 187, 188, 189, 107].includes(e.keyCode)) {
            e.preventDefault();
            return;
        }

        var val = $('#' + id).val();
        if (val.includes('.')) {
            if ([110].includes(e.keyCode)) {
                e.preventDefault();
            }

            if (val.split('.')[1].length == 2 && ![8, 9].includes(e.keyCode)) {
                e.preventDefault();
            }
        }
    });
}

function insertDefaultRow(ddl, defaultValue) {
    var tmpl = '<option value="-1">---' + defaultValue + '---</option>';
    $(ddl).empty();
    $(ddl).append(tmpl);
    $(ddl).val(-1).select2();
    //$(ddl).trigger('change');
}

function getDefaultValueForDropDown(defaultValue) {
    return '<option value="-1">---' + defaultValue + '---</option>';
}