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
    $('.clockpicker').clockpicker({
        autoclose: true,
        twelvehour: false
    });

    $("#addNewBtn").click(function () {
        $('#formAction').text('Add Meeting');
        $('#formValues').clearForm();
        $("#pnlMain").hide();
        $("#pnlHistory").hide();
        $("#pnlAdd").show();
        $("#ddlMeetingOccurance").val(-1).select2();
        $("#ddlAgendaAssignee").val(-1).select2();
        $("#ddlAttendeeAssignee").val(-1).select2();
        _id = 0;
    });

    $("#btnSave").click(function () {
        save();
    });

    $("#btnBack").click(function () {
        $("#pnlMain").show();
        $("#pnlAdd").hide();
    });

    $("#ddlAttendeeAssignee").select2({
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
            $("#ddlAttendeeAssignee").val(newValues).select2();
        })
        .on("select2:selecting", function (e) {
            $(this).data('oldval', $(this).val());
        })
        .on("select2:closing", function (e) {
            if ($(this).val() == null) {
                $("#ddlAttendeeAssignee").val(-1).select2();
            }
        });

    $("#btnExport").click(function () {
        $("#grid").jqGrid("exportToExcel", {
            includeLabels: true,
            includeGroupHeader: true,
            includeFooter: true,
            fileName: "Meeting.xlsx",
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
        url: '\Service.aspx?rq=MeetingOccuranceGetDropDownList',
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

            $("#ddlFilterMeetingOccurance").empty();
            $("#ddlFilterMeetingOccurance").append(tmpl);
            $("#ddlFilterMeetingOccurance").val(-1).select2();

            $("#ddlMeetingOccurance").empty();
            $("#ddlMeetingOccurance").append(tmpl.replace("---All---", "---Select---"));
            $("#ddlMeetingOccurance").val(-1).select2();
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

            $("#ddlAgendaAssignee").empty();
            $("#ddlAgendaAssignee").append(tmpl.replace("---All---", "---Select---"));
            $("#ddlAgendaAssignee").val(-1).select2();

            $("#ddlAttendeeAssignee").empty();
            $("#ddlAttendeeAssignee").append(tmpl.replace("---All---", "---Select---"));
            $("#ddlAttendeeAssignee").val(assignids).select2();
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
    var url = "\Service.aspx?rq=MeetingGetAll";
    var qtid = $('#ddlMeetingOccurance').val() == undefined ? '-1' : $('#ddlMeetingOccurance').val();
    $grid = $("#grid").jqGrid({
        url: url,
        datatype: "json",
        mtype: "POST",
        postData: JSON.stringify({ MeetingOccuranceID: qtid }),
        colNames: ['MeetingID', 'Title', 'Start Date', 'End Date', 'Start Time', 'End Time', 'MeetingOccuranceID', 'Occurance', 'Description', 'Location', 'Agenda Title', 'Agenda Assignee', 'Agenda Comments', 'Attendee Assignee'],
        colModel: [
            { name: 'MeetingID', index: 'MeetingID', key: true, search: true, align: 'center', hidden: true },
            { name: 'Title', index: 'Title', search: true },
            { name: 'StartDate', index: 'StartDate', search: true, align: 'center', width: '100', formatter: 'date', formatoptions: { srcformat: "m/d/Y H:i A", newformat: 'ShortDate' } },
            { name: 'EndDate', index: 'EndDate', search: true, align: 'center', width: '100', formatter: 'date', formatoptions: { srcformat: "m/d/Y H:i A", newformat: 'ShortDate' } },
            { name: 'StartTime', index: 'StartTime', search: true, align: 'center', width: '100', formatter: startTimeFormatter },
            { name: 'EndTime', index: 'EndTime', search: true, align: 'center', width: '100', formatter: endTimeFormatter },
            { name: 'MeetingOccuranceID', index: 'MeetingOccuranceID', search: true, hidden: true },
            { name: 'Occurance', index: 'Occurance', search: true },
            { name: 'Description', index: 'Description', search: true, hidden: true },
            { name: 'Location', index: 'Location', search: true, hidden: true },
            { name: 'AgendaTitle', index: 'AgendaTitle', search: true, hidden: true },
            { name: 'AgendaAssigneeID', index: 'AgendaAssigneeID', search: true, hidden: true },
            { name: 'AgendaComments', index: 'AgendaComments', search: true, hidden: true },
            { name: 'AttendeeAssigneeID', index: 'AttendeeAssigneeID', search: true, hidden: true },
        ],

        jsonReader: { repeatitems: false },
        viewrecords: true,
        loadonce: true,
        caption: '&nbsp;&nbsp;Meeting',
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
                        $('#formAction').text("Edit Meeting");
                        var rowData = $("#grid").jqGrid('getRowData', trigger.id);
                        edit(rowData);
                    },
                    'Delete': function (trigger) {
                        var rowData = $("#grid").jqGrid('getRowData', trigger.id);
                        remove(rowData.MeetingID);
                    },
                    'FollowUp': function (trigger) {
                        $("#pnlMain").hide();
                        $("#pnlAdd").show();
                        $("#pnlHistory").show();
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
    o.MeetingID = _id;
    o.MeetingOccuranceID = $("#ddlMeetingOccurance").val();
    o.Title = $('#txtTitle').val().trim();
    o.Description = $('#txtDescription').val().trim();
    o.StartDate = $('#txtStartDate').val().trim();
    o.EndDate = $('#txtEndDate').val().trim();
    o.StartTime = $('#txtStartTime').val(); 
    o.EndTime = $('#txtEndTime').val(); 
    o.Location = $('#txtLocation').val().trim();
    o.AgendaTitle = $('#txtAgendaTitle').val().trim();
    o.AgendaAssigneeID = $("#ddlAgendaAssignee").val();
    o.AgendaComments = $('#txtAgendaComments').val().trim();
    o.AttendeeAssigneeID = $("#ddlAttendeeAssignee").val();

    if (o.MeetingOccuranceID == '-1') {
        toastr["error"]("Please select occurance.");
        isError = true;
    }

    if (o.Title == '') {
        toastr["error"]("Please enter title.");
        isError = true;
    }

    if (o.Description == '') {
        toastr["error"]("Please enter description.");
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

    if (o.StartTime == '') {
        toastr["error"]("Please select start time.");
        isError = true;
    }

    if (o.EndTime == '') {
        toastr["error"]("Please select end time.");
        isError = true;
    }

    if (o.StartDate >= o.EndDate) {
        toastr["error"]("end date can not be earlier then start date");
        isError = true;
    }

    if (o.Location == '') {
        toastr["error"]("Please enter location.");
        isError = true;
    }

    if (o.AgendaTitle == '') {
        toastr["error"]("Please enter agenda title.");
        isError = true;
    }

    if (o.AgendaComments == '') {
        toastr["error"]("Please enter agenda comments.");
        isError = true;
    }

    if (o.AgendaAssigneeID == '-1') {
        toastr["error"]("Please select agenda assignee.");
        isError = true;
    }

    if (o.AttendeeAssigneeID == null || o.AttendeeAssigneeID == 'undefined' || o.AttendeeAssigneeID.length == 0) {
        toastr["error"]("Please select attendee assignee.");
        isError = true;
    }

    if (!isError) {
        showLoadingPopup();
        $.ajax({
            url: '\Service.aspx?rq=MeetingInsertOrUpdate',
            type: 'POST',
            dataType: "json",
            data: JSON.stringify(o)
        }).done(function (sr) {
            if (sr.HasError == false) {
                bindjqGrid();
                $("#btnBack").trigger('click');
                if (o.MeetingID == 0)
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

    _id = data.MeetingID;
    $('#ddlMeetingOccurance').val(data.MeetingOccuranceID).select2();
    $('#txtTitle').val(data.Title);
    $('#txtDescription').val(data.Description);
    $('#txtStartDate').val(GetDate(data.StartDate));
    $('#txtEndDate').val(GetDate(data.EndDate));
    $("#txtStartTime").val(getTimeOnly(data.StartTime));
    $("#txtEndTime").val(getTimeOnly(data.EndTime));
    $('#txtLocation').val(data.Location);
    $('#txtAgendaTitle').val(data.AgendaTitle);
    $('#ddlAgendaAssignee').val(data.AgendaAssigneeID).select2();
    $('#txtAgendaComments').val(data.AgendaComments);

    assignids = data.AssigneeID.split(',');
    $('#ddlAttendeeAssignee').val(assignids).select2();
}

function remove(id) {
    showLoadingPopup();
    $.ajax({
        url: '\Service.aspx?rq=MeetingDelete',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify({ ID: id })
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

function startTimeFormatter(cellvalue, options, rowObject) {
    return rowObject.StartTime == null ? "" : GetTime(rowObject.StartTime);
}

function endTimeFormatter(cellvalue, options, rowObject) {
    return rowObject.EndTime == null ? "" : GetTime(rowObject.EndTime);
}

function GetTime(json) {
    return new moment(json).format('hh:mm A');
}

function getTimeOnly(time) {
    return new moment("01/01/2001 " + time).format('hh:mm');
}
