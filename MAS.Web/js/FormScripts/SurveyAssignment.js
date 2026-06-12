var _id = 0;
var assignids = -1;

$(document).ready(function () {
    // grid responsive on menu toggle
    $(window).on('MenuToggle', function () {
        var width = $('#ParentDiv').width();
        $('#grid').setGridWidth(width);
    });

    showLoadingPopup();
    pageLoad();
    bindjqGrid();
    $('.datePicker').datepicker({
        format: "mm/dd/yyyy",
        autoclose: true
    });

    $("#addNewBtn").click(function () {
        $('#formAction').text('Add Survey Assignment');
        $('#formValues').clearForm();
        $("#pnlMain").hide();
        $("#pnlHistory").hide();
        $("#pnlAdd").show();
        $("#ddlSurvey").val(-1).select2();
        $("#ddlAssignee").val(-1).select2();
        _id = 0;
    });

    $("#btnSave").click(function () {
        save();
    });

    $("#btnBack").click(function () {
        $("#pnlMain").show();
        $("#pnlAdd").hide();
    });

    $("#ddlAssignee").select2({
        allowClear: true
    })
        .on("select2:select select2:unselecting", function (e) {
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
            $("#ddlAssignee").val(newValues).select2();
        })
        .on("select2:selecting", function (e) {
            $(this).data('oldval', $(this).val());
        })
        .on("select2:closing", function (e) {
            if ($(this).val() == null) {
                $("#ddlAssignee").val(-1).select2();
            }
        });

    $("#btnExport").click(function () {
        $("#grid").jqGrid("exportToExcel", {
            includeLabels: true,
            includeGroupHeader: true,
            includeFooter: true,
            fileName: "Knowledge.xlsx",
            maxlength: 40 // maxlength for visible string data 
        });
    });
});

function pageLoad() {
    showLoadingPopup();

    obj =
    {
        isActive: null,
        defaultKey: -1,
        defaultValue: '---All---'
    };
    var v2 = $.ajax({
        url: '\Service.aspx?rq=SurveyGetDropDownList',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(obj),
    }).done(function (sr) {
        if (sr.HasError == false) {
            _surveyTypeData = sr.Data;

            var tmpl;
            _surveyTypeData.forEach(function (a) {
                tmpl += '<option value="' + a.Key + '">' + a.Value + '</option>';
            });

            $("#ddlFilterSurvey").empty();
            $("#ddlFilterSurvey").append(tmpl);
            $("#ddlFilterSurvey").val(-1).select2();

            $("#ddlSurvey").empty();
            $("#ddlSurvey").append(tmpl.replace("---All---", "---Select---"));
            $("#ddlSurvey").val(-1).select2();
        } else {
            toastr["error"](sr.ErrorMessage);
        }
        closeLoadingPopup();
    }).fail(function () {
        closeLoadingPopup();
        toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
    });



    obj =
    {
        //isActive: null,
        defaultKey: -1,
        defaultValue: '---All---'
    };
    var v2 = $.ajax({
        url: '\Service.aspx?rq=UserGetDropDownList',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(obj),
    }).done(function (sr) {
        if (sr.HasError == false) {
            _questionTypeData = sr.Data;

            var tmpl;
            _questionTypeData.forEach(function (a) {
                tmpl += '<option value="' + a.Key + '">' + a.Value + '</option>';
            });

            //$("#ddlFilterQuestionType").empty();
            //$("#ddlFilterQuestionType").append(tmpl);
            //$("#ddlFilterQuestionType").val(-1).select2();

            $("#ddlAssignee").empty();
            $("#ddlAssignee").append(tmpl.replace("---All---", "---Select---"));
            $("#ddlAssignee").val(assignids).select2();
        } else {
            toastr["error"](sr.ErrorMessage);
        }
        closeLoadingPopup();
    }).fail(function () {
        closeLoadingPopup();
        toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
    });
}

function bindjqGrid() {
    var url = "\Service.aspx?rq=SurveyAssignmentGetAll";
    var sid = $('#ddlSurveyID').val() == undefined ? '-1' : $('#ddlSurveyID').val();
    $grid = $("#grid").jqGrid({
        url: url,
        datatype: "json",
        mtype: "POST",
        postData: JSON.stringify({ surveyAssignmentID: sid }),
        colNames: ['Survey Assignment ID', 'Survey ID', 'Survey', 'Start Date', 'End Date', 'Active'],
        colModel: [
            { name: 'SurveyAssignmentID', index: 'SurveyAssignmentID', key: true, search: true, align: 'center', hidden: true },
            { name: 'SurveyID', index: 'SurveyID', search: true, hidden: true },
            { name: 'Survey', index: 'Survey', search: true },
            { name: 'StartDate', index: 'StartDate', search: true, align: 'center', width: '100', formatter: 'date', formatoptions: { srcformat: "m/d/Y H:i A", newformat: 'ShortDate' } },
            { name: 'EndDate', index: 'EndDate', search: true, align: 'center', width: '100', formatter: 'date', formatoptions: { srcformat: "m/d/Y H:i A", newformat: 'ShortDate' } },
            { name: 'IsActive', index: 'IsActive', search: true, align: 'center' },
        ],
        jsonReader: { repeatitems: false },
        viewrecords: true,
        loadonce: true,
        caption: '&nbsp;&nbsp;Survey Assignment',
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
                        $('#formAction').text("Edit Survey Assignment");
                        var rowData = $("#grid").jqGrid('getRowData', trigger.id);
                        edit(rowData);
                    },
                    'Delete': function (trigger) {
                        var rowData = $("#grid").jqGrid('getRowData', trigger.id);
                        remove(rowData.SurveyAssignmentID);
                    },
                },
                onContextMenu: function (event) {
                    return true;
                }
            });
            var width = $('#ParentDiv').width();
            $('#grid').setGridWidth(width);
        }
    });
    $("#grid").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: true, defaultSearch: 'cn' });
    $("#grid").jqGrid('setGridParam', { url: url, datatype: "json", page: 1 }).trigger("reloadGrid");
}

function save() {
    isError = false;

    var o = {};
    o.SurveyAssignmentID = _id;
    o.SurveyID = $("#ddlSurvey").val();
    o.StartDate = $('#txtStartDate').val().trim();
    o.EndDate = $('#txtEndDate').val().trim();
    o.IsActive = true;
    o.AssigneeID = $("#ddlAssignee").val();

    if (o.SurveyID == '-1') {
        toastr["error"]("Please select survey.");
        isError = true;
    }

    if (o.StartDate == '') {
        toastr["error"]("Please select start date.");
        isError = true;
    }

    if (o.EndDate == '') {
        toastr["error"]("Please select end date.");
        isError = true;
    }

    if (o.AssigneeID == null || o.AssigneeID == 'undefined' || o.AssigneeID.length == 0) {
        toastr["error"]("Please select assignee.");
        isError = true;
    }

    if (o.StartDate >= o.EndDate) {
        toastr["error"]("end date can not be earlier then start date");
        isError = true;
    }

    if (!isError) {
        showLoadingPopup();
        $.ajax({
            url: '\Service.aspx?rq=SurveyAssignmentInsertOrUpdate',
            type: 'POST',
            dataType: "json",
            data: JSON.stringify(o)
        }).done(function (sr) {
            if (sr.HasError == false) {
                bindjqGrid();
                $("#btnBack").trigger('click');
                if (o.SurveyAssignmentID == 0)
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

function edit(data) {
    $('#formValues').clearForm();
    $("#pnlMain").hide();
    $("#pnlAdd").show();

    _id = data.SurveyAssignmentID;
    $("#id").val(data.SurveyAssignmentID);
    $('#ddlSurvey').val(data.SurveyID).select2(); 
    $('#txtStartDate').val(GetDate(data.StartDate));
    $('#txtEndDate').val(GetDate(data.EndDate));
    data.isActive = true;
    //assignids = data.AssigneeID.split(',');
    $('#ddlAssignee').val(data.AssigneeID).select2();
}

function remove(id) {
    showLoadingPopup();
    $.ajax({
        url: '\Service.aspx?rq=SurveyAssignmentDelete',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify({ SurveyAssignmentID: id })
    }).done(function (sr) {
        if (sr.HasError == false) {
            bindjqGrid();
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

$(document).ajaxStop(function () {
    closeLoadingPopup();
});

// Add responsive to jqGrid
$(window).bind('resize', function () {
    var width = $('#ParentDiv').width();
    $('#grid').setGridWidth(width);
});
