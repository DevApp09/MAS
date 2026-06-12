var _id = 0;
var $grid = null;
var noOfFields = 0;
var isEdit = false;

$(document).ready(function () {
    // grid responsive on menu toggle
    $(window).on('MenuToggle', function () {
        var width = $('#ParentDiv').width();
        $('#grid').setGridWidth(width);
    });

    showLoadingPopup();
    bindjqGrid();
    bindSurveyQuestions();

    $('.datePicker').datepicker({
        format: "mm/dd/yyyy",
        autoclose: true
    });

    $("#addNewBtn").click(function () {
        $('#formValues').clearForm();
        $("#isActive").empty();
        $("#mainPnl").hide();
        $("#addNewPnl").show();
        $("#formAction").text('Add Group');
        $("#ddlQuestion").val(-1).select2();
        _id = 0;
        isEdit = false;
    });

    $("#goBackBtn").click(function () {
        $("#mainPnl").show();
        $("#addNewPnl").hide();
    });

    $("#btnSave").click(function () {
        save();
    });

    $("#ddlQuestion")
    .on("change", function (e) {
        var oldValues = $(this).data('oldval');
        var newValues = $(this).val();

        if (newValues == null) {
            newValues = -1;
        }
        else if (oldValues == null) {
            newValues = newValues;
        }
        else if (oldValues.indexOf('-1') == -1 && newValues.indexOf('-1') > 0) {
            newValues = -1;
        }
        else {

            if (newValues.length > 0) {
                newValues = $.grep(newValues, function (value) {
                    return value != -1;
                });
            }
            else if (newValues == null) {
                newValues = -1;
            }
            else {
                newValues = -1;
            }
        }
        $("#ddlQuestion").val(newValues).select2();
    })
    .on("select2:selecting", function (e) {
        $(this).data('oldval', $(this).val())
    });
});

function bindjqGrid() {

    var url = "\Service.aspx?rq=GetAllSurveyGroup";
    $grid = $("#grid").jqGrid({
        url: url,
        datatype: "json",
        mtype: "POST",
        postData: JSON.stringify({ companyID: $("#ddlcompany").val() }),
        colNames: ['ID', 'Name', 'Description', 'IsActive'],
        colModel: [
            { name: 'ID', index: 'ID', key: true, search: true, align: 'center', hidden: true },
            { name: 'Name', index: 'Name', search: true },
            { name: 'Description', index: 'Description', search: true },
            { name: 'IsActive', index: 'IsActive', search: true, align: 'center' },
        ],
        jsonReader: { repeatitems: false },
        viewrecords: true,
        loadonce: true,
        caption: '&nbsp;&nbsp;Questions',
        pager: '#gridpager',
        rowList: [5, 20, 50, 100, 200, 500],
        height: '320px',
        autowidth: true,
        altRows: true,
        altclass: 'myAltRowClass',
        ignoreCase: true,

        loadComplete: function () {
            $("tr.jqgrow", this).contextMenu('GridContextMenu', {
                bindings: {
                    'Edit': function (trigger) {
                        edit(trigger, false);
                    },
                    'View': function (trigger) {
                        edit(trigger, true);
                    },
                    'Delete': function (trigger) {
                        remove(trigger.id);
                    }
                },
                onContextMenu: function (event) {
                    return true;
                }
            });
        }
    });
    $("#grid").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: true, defaultSearch: 'cn' });
    $("#grid").jqGrid('setGridParam', { url: url, datatype: "json", page: 1 }).trigger("reloadGrid");
}

function bindSurveyQuestions() {
    obj =
        {
            companyID: $("#ddlcompany").val(),
            isActive: true,
            defaultKey: -1,
            defaultValue: '---All---'
        };
    $.ajax({
        url: '\Service.aspx?rq=GetAllQuestionsDropDown',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(obj),
    }).done(function (sr) {
        if (sr.HasError == false) {
            var table = sr.Data;
            var tmpl;
            table.forEach(function (a) {
                tmpl += '<option value="' + a.Key + '">' + a.Value + '</option>';
            });
            $("#ddlQuestion").empty();
            $("#ddlQuestion").append(tmpl);
            $("#ddlQuestion").val(-1).select2();


        } else {
            toastr["error"](sr.ErrorMessage);
        }
    }).fail(function () {
        toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
    });
}

function save() {
    isError = false;

    var name = $('#txtName').val().trim();
    var description = $('#txtDescription').val().trim();
    var questionIds = $('#ddlQuestion').val();
    var effectiveDate = $('#txtEffectiveDate').val();
    var endDate = $('#txtEndDate').val();

    if (name == '') {
        toastr["error"]("Please enter name");
        isError = true;
    }

    if (description == '') {
        toastr["error"]("Please enter description");
        isError = true;
    }

    if (questionIds == null) {
        toastr["error"]("Please select qustions");
        isError = true;
    }

    if (effectiveDate == '') {
        toastr["error"]("Please enter effective date.");
        isError = true;
    }

    if (endDate == '') {
        toastr["error"]("Please enter end date.");
        isError = true;
    }

    var effectiveDate2 = new Date(effectiveDate);
    var endDate2 = new Date(endDate);

    if (effectiveDate2 > endDate2) {
        toastr["error"]("End date cannot be earlier than effective date.");
        isError = true;
    }

    if (!isError) {

        var data = {
            ID: _id,
            Name: name,
            Description: description,
            QuestionIds: questionIds,
            EffectiveDate: effectiveDate,
            EndDate: endDate,
            IsActive: $("#isActive").is(":checked"),
            CompanyID: $("#ddlcompany").val()
        };

        showLoadingPopup();
        $.ajax({
            url: '\Service.aspx?rq=InsertOrUpdateGroupSurvey',
            type: 'POST',
            dataType: "json",
            data: JSON.stringify(data)
        }).done(function (sr) {
            if (sr.HasError == false) {

                $("#grid").trigger('reloadGrid');
                bindjqGrid();
                $("#goBackBtn").trigger('click');

                if (data.ID == 0)
                    toastr["success"]('Record has been saved successfully.');
                else
                    toastr["success"]('Record has been updated successfully.');
            } else {
                toastr["error"](sr.ErrorMessage);
            }
            closeLoadingPopup();
            }).fail(function () {
                closeLoadingPopup();
            toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
        });
    }
}

function edit(trigger, readonly) {

    $("#mainPnl").hide();
    $("#addNewPnl").show();

    _id = trigger.cells[0].innerText.trim();

    obj =
        {
            Id: _id,
            CompanyId: $("#ddlcompany").val()
        };

    $.ajax({
        url: '\Service.aspx?rq=GroupSurveyGetByID',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(obj),
    }).done(function (sr) {
        if (sr.HasError == false) {

            $('#txtName').val(sr.Data.Name);
            $('#txtDescription').val(sr.Data.Description);
            $('#txtEffectiveDate').val(GetDate(sr.Data.EffectiveDate));
            $('#txtEndDate').val(GetDate(sr.Data.EndDate));
            $("#ddlQuestion").val(sr.Data.QuestionIds).select2();
            $('#isActive').val(sr.Data.IsActive);
            isEdit = true;

            if (readonly) {
                $("#formAction").text('View Group');
                $('#txtName').prop('disabled', true);
                $('#txtDescription').prop('disabled', true);
                $('#txtEffectiveDate').prop('disabled', true);
                $('#txtEndDate').prop('disabled', true);
                $('#ddlQuestion').prop('disabled', true);
                $('#isActive').prop('disabled', true);
            } else {
                $("#formAction").text('Edit Group');
                $('#txtName').prop('disabled', false);
                $('#txtDescription').prop('disabled', false);
                $('#txtEffectiveDate').prop('disabled', false);
                $('#txtEndDate').prop('disabled', false);
                $('#ddlQuestion').prop('disabled', false);
                $('#isActive').prop('disabled', false);
            }
        } else {
            toastr["error"](sr.ErrorMessage);
        }
    }).fail(function () {
        toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
    });
}

function remove(id) {
    obj =
        {
            Id: id
        };

    showLoadingPopup();
    $.ajax({
        url: '\Service.aspx?rq=DeleteGroupSurvey',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(obj),
    }).done(function (sr) {
        if (sr.HasError == false) {
            $("#grid").trigger('reloadGrid');
            bindjqGrid();
            $("#btnBack").trigger('click');
            toastr["success"]('Record has been deleted successfully.');
        } else {
            toastr["error"](sr.ErrorMessage);
        }
        closeLoadingPopup();
        }).fail(function () {
            closeLoadingPopup();
        toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
    });
}

function GetDate(jsonDate) {
    if (jsonDate != null)
        return new moment(jsonDate).format('MM/DD/YYYY');

    return "";
}

function selectQuestions() {
    //if (!isEdit) {
        var data = $("#ddlQuestion").val();
        var newData = [];

        if (data.length > 1) {
            data.forEach(function (a) {
                if (a != -1) { newData.push(a); }
            });

            $("#ddlQuestion").val(newData).select2();
        }
    //}
}

$(document).ajaxStop(function () {
    closeLoadingPopup();
});

// Add responsive to jqGrid
$(window).bind('resize', function () {
    var width = $('#ParentDiv').width();
    $('#grid').setGridWidth(width);
});