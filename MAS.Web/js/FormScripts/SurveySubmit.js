var surveyData;
var imageLocation = '../img/';

$(document).ready(function () {
    // grid responsive on menu toggle
    $(window).on('MenuToggle', function () {
        var width = $('#ParentDiv').width();
        $('#grid').setGridWidth(width);
    });

    showLoadingPopup();
    bindjqGrid();
    $('.datePicker').datepicker({
        format: "mm/dd/yyyy",
        autoclose: true
    });

    $("#btnBack").click(function () {
        $("#pnlMain").show();
        $("#pnlSubmit").hide();
    });
});

function bindjqGrid() {
    var url = "\Service.aspx?rq=SurveySubmitGetAll";
    var sid = $('#ddlSurveyID').val() == undefined ? '-1' : $('#ddlSurveyID').val();
    $grid = $("#grid").jqGrid({
        url: url,
        datatype: "json",
        mtype: "POST",
        postData: JSON.stringify({ surveyAssignmentID: sid }),
        colNames: ['Survey Assignee ID', 'Survey ID', 'Survey', 'Start Date', 'End Date', 'Active', 'Submitted', 'Submitted Date'],
        colModel: [
            { name: 'SurveyAssigneeID', index: 'SurveyAssigneeID', key: true, search: true, align: 'center', hidden: true },
            { name: 'SurveyID', index: 'SurveyID', search: true, hidden: true },
            { name: 'Survey', index: 'Survey', search: true },
            { name: 'StartDate', index: 'StartDate', search: true, align: 'center', width: '100', formatter: 'date', formatoptions: { srcformat: "m/d/Y H:i A", newformat: 'ShortDate' } },
            { name: 'EndDate', index: 'EndDate', search: true, align: 'center', width: '100', formatter: 'date', formatoptions: { srcformat: "m/d/Y H:i A", newformat: 'ShortDate' } },
            { name: 'IsActive', index: 'IsActive', search: true, align: 'center' },
            { name: 'IsSubmitted', index: 'IsSubmitted', search: true, align: 'center' },
            { name: 'SubmittedDate', index: 'SubmittedDate', search: true, align: 'center', width: '100', formatter: 'date', formatoptions: { srcformat: "m/d/Y H:i A", newformat: 'ShortDate' } },
        ],
        jsonReader: { repeatitems: false },
        viewrecords: true,
        loadonce: true,
        caption: '&nbsp;&nbsp;Survey Submission',
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
                    'View': function (trigger) {
                        $('#formAction').text("Survey Submit");
                        var rowData = $("#grid").jqGrid('getRowData', trigger.id);
                        submit(rowData.SurveyAssigneeID);
                    },
                    'Delete': function (trigger) {
                        //$('#formAction').text("Survey Submit");
                        var rowData = $("#grid").jqGrid('getRowData', trigger.id);
                        remove(rowData.SurveyAssigneeID);
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

function remove(id) {
    showLoadingPopup();
    $.ajax({
        url: '\Service.aspx?rq=SurveySubmitDelete',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify({ SurveyAssigneeID: id })
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

function submit(id) {
    showLoadingPopup();
    $.ajax({
        url: '\Service.aspx?rq=SurveySubmitGetById',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify({ SurveyAssigneeID: id })
    }).done(function (sr) {
        if (sr.HasError == false) {
            $("#pnlMain").hide();
            $("#pnlSubmit").show();

            //var data = sr.Data;
            //var quest = data.SurveyQuestions;
            //$("#questionTmpl").tmpl(quest).appendTo($('#questionContainer').empty());  
            ////bindjqGrid();
            //toastr["success"]('Record has been deleted successfully.');
            surveyData = sr.Data;
            generateSurvey();
        } else {
            toastr["error"](sr.ErrorMessage);
        }
        closeLoadingPopup();
    }).fail(function () {
        closeLoadingPopup();
        toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
    });
}

function generateSurvey() {
    var html = '';
    for (var i = 0; i < surveyData.SurveyQuestions.length; i++) {
        //html += fillSurvey(surveyData.SurveyQuestions[i]);
        var qtid = surveyData.SurveyQuestions[i].QuestionTypeID;
        switch (qtid) {
            case 1:
                html += generateInputTextNumber(surveyData.SurveyQuestions[i]);
                break;
            case 2:
                html += generateInputDropdown(surveyData.SurveyQuestions[i]);
                break;
            case 3:
                html += generateInputRadioButton(surveyData.SurveyQuestions[i]);
                break;
            case 4:
                html += generateInputCheckbox(surveyData.SurveyQuestions[i], qtid);
                break;
            case 5:
                html += generateInputMultiCheckbox(surveyData.SurveyQuestions[i], qtid);
                break;
            case 6:
                html += generateInputTextDate(surveyData.SurveyQuestions[i]);
                break;
            case 7:
                html += generateInputText(surveyData.SurveyQuestions[i], qtid);
                break;
            case 8:
                html += generateInputText(surveyData.SurveyQuestions[i], qtid);
                break;
            case 9:
                html += generateInputImage(surveyData.SurveyQuestions[i], qtid);
                break;
            case -10:
                html += generateInputDropdown(surveyData.SurveyQuestions[i]);
                break;
            case -11:
                html += generateInputDropdown(surveyData.SurveyQuestions[i]);
                break;
            case -12:
                html += generateInputDropdown(surveyData.SurveyQuestions[i]);
                break;
            default:
                break;
        }
    }
    $('#divContent').html('')
    $('#divContent').append(html);
}

function fillSurvey(dat) {
    var answerData = Enumerable.From(surveyData.SurveySubmitQuestions);
    var answer = answerData
        .Where(function (item) { return item.QuestionID == dat.QuestionID; })
        .Select(function (item) { return item.Answer; })
        .ToArray();
    var str = ``;
    if (answer.length == 0) {
        str =
            `<div class="form-group">
            <label class="col-sm-12">`+ dat.Question + `</label >
            <div class="col-sm-12">
            </div>
        </div>`;
    }
    else {
        str =
            `<div class="form-group">
            <label class="col-sm-12">`+ dat.Question + `</label >
            <div class="col-sm-12">
                <input type="text" class="form-control" value="`+ answer + `" />
            </div>
        </div>`;
    }
    return str;
}

function getAnswer(pQuestionId, isId, pQuestionTypeId) {
    var answerData = Enumerable.From(surveyData.SurveySubmitQuestions);
    var answer = answerData
        .Where(function (item) { return item.QuestionID == pQuestionId; })
        .Select(function (item) { return item; })
        .ToArray();
    var txtAnswer = '';
    if (answer.length > 0) {
        if (isId)
            txtAnswer = answer[0].QuestionOptionID;
        else
            txtAnswer = answer[0].Answer;
    }
    if (pQuestionTypeId == 9 && txtAnswer.length > 0)
        txtAnswer = imageLocation + txtAnswer;
    return txtAnswer;
}

function generateInputTextNumber(pData) {
    var str = '<div class="form-group">';
    str += '<label class="col-sm-12"">' + pData.Question + '</label>';
    str += '<div class="col-sm-12" id="divQuestion' + pData.QuestionID + '">';
    str += '<input type="text" class="form-control" id="txtQuestion' + pData.QuestionID + '" value="' + getAnswer(pData.QuestionID, false, 0) + '" />';
    str += '</div>';
    str += '</div>';
    return str;
}

function generateInputDropdown(pData) {
    var option = Enumerable.From(surveyData.SurveyQuestionOptions)
        .Where(function (item) { return item.QuestionID == pData.QuestionID; })
        .Select(function (item) { return item; })
        .ToArray();

    var answer = getAnswer(pData.QuestionID, true, 0);

    var str = '<div class="form-group">';
    str += '<label class="col-sm-12"">'+ pData.Question + '</label>';
    str += '<div class="col-sm-12" id="divQuestion'+ pData.QuestionID + '">';
    str += '<select class="form-control" id="txtQuestion'+ pData.QuestionID + '">';

    for (var i = 0; i < option.length; i++) {
        if (option[i].QuestionOptionID == answer)
            str += '<option selected value="' + option[i].QuestionOptionID + '">' + option[i].Option + '</option>';
        else
            str += '<option value="' + option[i].QuestionOptionID + '">' + option[i].Option + '</option>';
    }

    str += '</select>';
    str += '</div>';
    str += '</div>';
    return str;
}

function generateInputRadioButton(pData) {
    var option = Enumerable.From(surveyData.SurveyQuestionOptions)
        .Where(function (item) { return item.QuestionID == pData.QuestionID; })
        .Select(function (item) { return item; })
        .ToArray();

    var answer = getAnswer(pData.QuestionID, true, 0);

    var str = '<div class="form-group">';
    str += '<label class="col-sm-12"">' + pData.Question + '</label>';
    str += '<div class="col-sm-12" id="divQuestion' + pData.QuestionID + '">';

    for (var i = 0; i < option.length; i++) {
        if (option[i].QuestionOptionID == answer)
            str += '<label> <input checked="checked" type="radio" name="rdo' + pData.QuestionID + '" id="txtQuestion' + pData.QuestionID + '" value="' + option[i].QuestionOptionID + '">' + option[i].Option + "</label><br>";
        else
            str += '<label> <input type="radio" name="rdo' + pData.QuestionID + '" id="txtQuestion' + pData.QuestionID + '" value="' + option[i].QuestionOptionID + '">' + option[i].Option + "</label><br>";
    }

    str += '</div>';
    str += '</div>';
    return str;
}

function generateInputCheckbox(pData, pqtid) {
    var option = Enumerable.From(surveyData.SurveyQuestionOptions)
        .Where(function (item) { return item.QuestionID == pData.QuestionID; })
        .Select(function (item) { return item; })
        .ToArray();

    var answer = getAnswer(pData.QuestionID, true, pqtid);

    var str = '<div class="form-group">';
    str += '<label class="col-sm-12"">' + pData.Question + '</label>';
    str += '<div class="col-sm-12" id="divQuestion' + pData.QuestionID + '">';

    for (var i = 0; i < option.length; i++) {
        if (option[i].QuestionOptionID == answer)
            str += '<label> <input checked="checked" type="checkbox" name="rdo' + pData.QuestionID + '" id="txtQuestion' + pData.QuestionID + '" value="' + option[i].QuestionOptionID + '">' + option[i].Option + "</label><br>";
        else
            str += '<label> <input type="checkbox" name="rdo' + pData.QuestionID + '" id="txtQuestion' + pData.QuestionID + '" value="' + option[i].QuestionOptionID + '">' + option[i].Option + "</label><br>";
    }

    str += '</div>';
    str += '</div>';
    return str;
}

function generateInputMultiCheckbox(pData, pqtid) {
    var option = Enumerable.From(surveyData.SurveyQuestionOptions)
        .Where(function (item) { return item.QuestionID == pData.QuestionID; })
        .Select(function (item) { return item; })
        .ToArray();

    var answer = getAnswer(pData.QuestionID, false, pqtid);

    var str = '<div class="form-group">';
    str += '<label class="col-sm-12"">' + pData.Question + '</label>';
    str += '<div class="col-sm-12" id="divQuestion' + pData.QuestionID + '">';

    for (var i = 0; i < option.length; i++) {
        var qAnsOption = answer.split(',');
        var qAns = Enumerable.From(qAnsOption)
            .Where(function (item) { return item == option[i].QuestionOptionID; })
            .Select(function (item) { return item; })
            .ToArray();
        if (qAns.length > 0)
            str += '<label> <input checked="checked" type="checkbox" name="rdo' + pData.QuestionID + '" id="txtQuestion' + pData.QuestionID + '" value="' + option[i].QuestionOptionID + '">' + option[i].Option + "</label><br>";
        else
            str += '<label> <input type="checkbox" name="rdo' + pData.QuestionID + '" id="txtQuestion' + pData.QuestionID + '" value="' + option[i].QuestionOptionID + '">' + option[i].Option + "</label><br>";
    }

    str += '</div>';
    str += '</div>';
    return str;
}

function generateInputTextDate(pData) {
    var str = '<div class="form-group">';
    str += '<label class="col-sm-12"">' + pData.Question + '</label>';
    str += '<div class="col-sm-12" id="divQuestion' + pData.QuestionID + '">';
    str += '<input type="text" class="form-control datePicker" placeholder="MM/DD/YY" data-provide="datepicker" readonly="readonly" maxlength="10" id="txtQuestion' + pData.QuestionID + '" value="' + getAnswer(pData.QuestionID, false, 0) + '" />';
    str += '</div>';
    str += '</div>';
    return str;
}

function generateInputText(pData, pqtid) {
    var str = '<div class="form-group">';
    str += '<label class="col-sm-12"">' + pData.Question + '</label>';
    str += '<div class="col-sm-12" id="divQuestion' + pData.QuestionID + '">';
    if (pqtid == 7)
        str += '<input type="text" class="form-control" id="txtQuestion' + pData.QuestionID + '" value="' + getAnswer(pData.QuestionID, false, 0) + '" />';
    else {
        str += '<textarea rows="3" class="form-control" id="txtQuestion' + pData.QuestionID + '">';
        str += getAnswer(pData.QuestionID, false, 0);
        str += '</textarea>';
    }
    str += '</div>';
    str += '</div>';
    return str;
}

function generateInputImage(pData, pqtid) {
    var ans = getAnswer(pData.QuestionID, false, pqtid);
    var str = '<div class="form-group">';
    str += '<label class="col-sm-12"">' + pData.Question + '</label>';
    str += '<div class="col-sm-12" id="divQuestion' + pData.QuestionID + '">';
    if (ans.length > 0)
        str += '<img alt="image" id="txtQuestion' + pData.QuestionID + '" src="' + ans + '" />';
    str += '</div>';
    str += '</div>';
    return str;
}

$(document).ajaxStop(function () {
    closeLoadingPopup();
});

// Add responsive to jqGrid
$(window).bind('resize', function () {
    var width = $('#ParentDiv').width();
    $('#grid').setGridWidth(width);
});
